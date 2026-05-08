"""
Encrypted Key Store for Provider API Keys
Stores API keys securely using Fernet encryption.
Keys are read from environment variables first, then fall back to encrypted store.
"""

import os
import json
import logging
from pathlib import Path
from typing import Dict, Optional

logger = logging.getLogger(__name__)

KEY_STORE_PATH = Path("core/system/provider_keys.enc")
KEY_FILE_PATH = Path("core/system/provider_key.key")

class ProviderKeyStore:
    """Manages encrypted storage of provider API keys."""
    
    def __init__(self):
        self._ensure_key_file()
        self._load_key()
    
    def _ensure_key_file(self) -> None:
        """Generate Fernet key if missing."""
        if not KEY_FILE_PATH.exists():
            try:
                from cryptography.fernet import Fernet
                key = Fernet.generate_key()
                KEY_FILE_PATH.parent.mkdir(parents=True, exist_ok=True)
                with open(KEY_FILE_PATH, "wb") as f:
                    f.write(key)
                # Restrict permissions (Unix-like systems)
                try:
                    os.chmod(str(KEY_FILE_PATH), 0o600)
                except:
                    pass  # Windows doesn't support chmod
                logger.info("Generated new key encryption key at %s", KEY_FILE_PATH)
            except ImportError:
                logger.warning("cryptography package not installed; using plain text storage")
    
    def _load_key(self):
        """Load or generate Fernet key."""
        try:
            from cryptography.fernet import Fernet
            if KEY_FILE_PATH.exists():
                with open(KEY_FILE_PATH, "rb") as f:
                    self.key = f.read()
                self.fernet = Fernet(self.key)
            else:
                self.fernet = None
        except ImportError:
            self.fernet = None
    
    def get_api_key(self, provider_name: str, env_var: Optional[str] = None) -> Optional[str]:
        """Get API key for a provider.
        
        Priority:
        1. Environment variable (if env_var is provided)
        2. Encrypted key store
        3. None
        """
        # Try environment variable first
        if env_var:
            key = os.environ.get(env_var)
            if key:
                return key
        
        # Fall back to encrypted store
        return self._get_from_store(provider_name)
    
    def _get_from_store(self, provider_name: str) -> Optional[str]:
        """Retrieve decrypted key from store."""
        if not KEY_STORE_PATH.exists() or not self.fernet:
            return None
        
        try:
            with open(KEY_STORE_PATH, "rb") as f:
                encrypted_data = f.read()
            
            decrypted_data = self.fernet.decrypt(encrypted_data)
            key_store = json.loads(decrypted_data.decode('utf-8'))
            return key_store.get(provider_name)
        except Exception as exc:
            logger.error("Failed to read key store: %s", exc)
            return None
    
    def store_api_key(self, provider_name: str, api_key: str) -> bool:
        """Encrypt and store API key."""
        if not self.fernet:
            logger.warning("Encryption not available; storing in plain text is not supported")
            return False
        
        try:
            # Load existing keys
            key_store = {}
            if KEY_STORE_PATH.exists():
                with open(KEY_STORE_PATH, "rb") as f:
                    encrypted_data = f.read()
                decrypted_data = self.fernet.decrypt(encrypted_data)
                key_store = json.loads(decrypted_data.decode('utf-8'))
            
            # Update with new key
            key_store[provider_name] = api_key
            
            # Encrypt and save
            json_data = json.dumps(key_store).encode('utf-8')
            encrypted_data = self.fernet.encrypt(json_data)
            
            KEY_STORE_PATH.parent.mkdir(parents=True, exist_ok=True)
            with open(KEY_STORE_PATH, "wb") as f:
                f.write(encrypted_data)
            
            logger.info("Stored API key for %s", provider_name)
            return True
        except Exception as exc:
            logger.error("Failed to store API key: %s", exc)
            return False
    
    def delete_api_key(self, provider_name: str) -> bool:
        """Remove API key from store."""
        if not KEY_STORE_PATH.exists() or not self.fernet:
            return False
        
        try:
            with open(KEY_STORE_PATH, "rb") as f:
                encrypted_data = f.read()
            decrypted_data = self.fernet.decrypt(encrypted_data)
            key_store = json.loads(decrypted_data.decode('utf-8'))
            
            if provider_name in key_store:
                del key_store[provider_name]
                
                # Re-encrypt and save
                json_data = json.dumps(key_store).encode('utf-8')
                encrypted_data = self.fernet.encrypt(json_data)
                
                with open(KEY_STORE_PATH, "wb") as f:
                    f.write(encrypted_data)
                
                logger.info("Deleted API key for %s", provider_name)
                return True
            return False
        except Exception as exc:
            logger.error("Failed to delete API key: %s", exc)
            return False
    
    def list_providers_with_keys(self) -> list:
        """List providers that have stored keys."""
        if not KEY_STORE_PATH.exists() or not self.fernet:
            return []
        
        try:
            with open(KEY_STORE_PATH, "rb") as f:
                encrypted_data = f.read()
            decrypted_data = self.fernet.decrypt(encrypted_data)
            key_store = json.loads(decrypted_data.decode('utf-8'))
            return list(key_store.keys())
        except Exception:
            return []

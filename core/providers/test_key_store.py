"""
Tests for ProviderKeyStore
"""

import pytest
from unittest.mock import Mock, patch, MagicMock
from pathlib import Path
from core.providers.key_store import ProviderKeyStore

class TestProviderKeyStore:
    """Test suite for ProviderKeyStore."""
    
    def setup_method(self):
        """Set up for each test."""
        # Clear any existing key store files
        key_store_path = Path("core/system/provider_keys.enc")
        key_file_path = Path("core/system/provider_key.key")
        if key_store_path.exists():
            key_store_path.unlink()
        if key_file_path.exists():
            key_file_path.unlink()
    
    @patch("core.providers.key_store.Fernet")
    def test_initialization_with_encryption(self, mock_fernet):
        """Test initialization when cryptography is available."""
        mock_fernet.generate_key.return_value = b"test-key-123456789012345678901234567890"
        mock_instance = Mock()
        mock_fernet.return_value = mock_instance
        
        store = ProviderKeyStore()
        assert store.fernet is not None
    
    def test_initialization_without_encryption(self):
        """Test initialization when cryptography is not available."""
        with patch("core.providers.key_store.Fernet", side_effect=ImportError):
            store = ProviderKeyStore()
            assert store.fernet is None
    
    @patch("core.providers.key_store.Fernet")
    def test_store_and_retrieve_key(self, mock_fernet):
        """Test storing and retrieving API keys."""
        # Mock Fernet
        mock_instance = Mock()
        mock_instance.encrypt.return_value = b"encrypted-data"
        mock_instance.decrypt.return_value = b'{"openai": "sk-test-key-12345"}'
        mock_fernet.return_value = mock_instance
        mock_fernet.generate_key.return_value = b"test-key-123456789012345678901234567890"
        
        store = ProviderKeyStore()
        
        # Store a key
        result = store.store_api_key("openai", "sk-test-key-12345")
        assert result == True
        
        # Retrieve the key
        key = store.get_api_key("openai")
        assert key == "sk-test-key-12345"
    
    @patch("core.providers.key_store.Fernet")
    def test_get_key_from_env(self, mock_fernet):
        """Test getting key from environment variable."""
        with patch.dict("os.environ", {"OPENAI_API_KEY": "env-key-12345"}):
            store = ProviderKeyStore()
            key = store.get_api_key("openai", env_var="OPENAI_API_KEY")
            assert key == "env-key-12345"
    
    @patch("core.providers.key_store.Fernet")
    def test_delete_key(self, mock_fernet):
        """Test deleting an API key."""
        mock_instance = Mock()
        # First call returns data with key, second call returns data without key
        mock_instance.decrypt.side_effect = [
            b'{"openai": "sk-test-key", "anthropic": "sk-ant-key"}',
            b'{"anthropic": "sk-ant-key"}'
        ]
        mock_instance.encrypt.return_value = b"encrypted-data"
        mock_fernet.return_value = mock_instance
        mock_fernet.generate_key.return_value = b"test-key-123456789012345678901234567890"
        
        store = ProviderKeyStore()
        
        # Store keys first
        store.store_api_key("openai", "sk-test-key")
        store.store_api_key("anthropic", "sk-ant-key")
        
        # Delete one key
        result = store.delete_api_key("openai")
        assert result == True
        
        # Verify it's deleted
        key = store.get_api_key("openai")
        assert key is None
    
    @patch("core.providers.key_store.Fernet")
    def test_list_providers_with_keys(self, mock_fernet):
        """Test listing providers that have stored keys."""
        mock_instance = Mock()
        mock_instance.decrypt.return_value = b'{"openai": "key1", "anthropic": "key2", "google": "key3"}'
        mock_fernet.return_value = mock_instance
        mock_fernet.generate_key.return_value = b"test-key-123456789012345678901234567890"
        
        store = ProviderKeyStore()
        
        providers = store.list_providers_with_keys()
        assert len(providers) == 3
        assert "openai" in providers
        assert "anthropic" in providers
        assert "google" in providers
    
    def test_get_api_key_no_encryption(self):
        """Test getting key when encryption is not available."""
        with patch("core.providers.key_store.Fernet", side_effect=ImportError):
            store = ProviderKeyStore()
            key = store.get_api_key("openai")
            assert key is None
    
    @patch("core.providers.key_store.Fernet")
    def test_store_api_key_no_encryption(self, mock_fernet):
        """Test storing key when encryption is not available."""
        mock_fernet.side_effect = ImportError
        
        store = ProviderKeyStore()
        result = store.store_api_key("openai", "test-key")
        assert result == False

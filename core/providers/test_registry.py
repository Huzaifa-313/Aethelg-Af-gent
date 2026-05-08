"""
Tests for ProviderManager (Registry)
"""

import pytest
from unittest.mock import Mock, patch
from core.providers.registry import ProviderManager
from core.providers.base import BaseProvider

class MockProvider(BaseProvider):
    def list_models(self):
        return ["model-1", "model-2"]
    
    def chat_completion(self, model, messages, **kwargs):
        return {"response": "test"}

class TestProviderManager:
    """Test suite for ProviderManager."""
    
    def setup_method(self):
        """Set up for each test."""
        # Clear singleton instance
        ProviderManager._instance = None
    
    def test_singleton_pattern(self):
        """Test that ProviderManager follows singleton pattern."""
        manager1 = ProviderManager()
        manager2 = ProviderManager()
        assert manager1 is manager2
    
    def test_register_provider(self):
        """Test provider registration."""
        manager = ProviderManager()
        
        config = {
            "name": "TestProvider",
            "class": "test_module.TestProvider",
            "api_key_env": "TEST_KEY",
            "endpoint": "https://test.com/v1"
        }
        
        # Mock the import
        with patch("importlib.import_module") as mock_import:
            mock_module = Mock()
            mock_module.TestProvider = MockProvider
            mock_import.return_value = mock_module
            
            manager.register_provider("test", config)
            
            # Check provider was registered
            assert "test" in manager._providers
    
    def test_get_provider(self):
        """Test getting a registered provider."""
        manager = ProviderManager()
        
        # Register a mock provider
        manager._providers["test"] = MockProvider({})
        
        provider = manager.get_provider("test")
        assert provider is not None
        assert isinstance(provider, MockProvider)
    
    def test_get_nonexistent_provider(self):
        """Test getting a provider that doesn't exist."""
        manager = ProviderManager()
        
        with pytest.raises(Exception):
            manager.get_provider("nonexistent")
    
    def test_list_providers(self):
        """Test listing all providers."""
        manager = ProviderManager()
        
        # Add some mock providers
        manager._providers["provider1"] = Mock()
        manager._providers["provider2"] = Mock()
        
        providers = manager.list_providers()
        assert len(providers) == 2
        assert "provider1" in providers
        assert "provider2" in providers
    
    def test_get_all_models(self):
        """Test getting all models from all providers."""
        manager = ProviderManager()
        
        # Create mock providers with different models
        provider1 = Mock()
        provider1.list_models.return_value = ["model-1a", "model-1b"]
        
        provider2 = Mock()
        provider2.list_models.return_value = ["model-2a"]
        
        manager._providers["prov1"] = provider1
        manager._providers["prov2"] = provider2
        
        all_models = manager.get_all_models()
        assert len(all_models) == 3
        assert "prov1/model-1a" in all_models
        assert "prov1/model-1b" in all_models
        assert "prov2/model-2a" in all_models
    
    def test_get_model_details(self):
        """Test parsing model reference."""
        manager = ProviderManager()
        
        details = manager.get_model_details("openai/gpt-4")
        assert details["provider"] == "openai"
        assert details["model"] == "gpt-4"
    
    def test_get_model_details_invalid(self):
        """Test parsing invalid model reference."""
        manager = ProviderManager()
        
        with pytest.raises(Exception):
            manager.get_model_details("invalid-model-ref")
    
    def test_health_check(self):
        """Test health check for all providers."""
        manager = ProviderManager()
        
        # Create mock providers
        provider1 = Mock()
        provider1.health_check.return_value = True
        
        provider2 = Mock()
        provider2.health_check.return_value = False
        
        manager._providers["prov1"] = provider1
        manager._providers["prov2"] = provider2
        
        health = manager.health_check()
        assert health["prov1"] == True
        assert health["prov2"] == False
    
    def test_fallback_provider(self):
        """Test fallback provider selection."""
        manager = ProviderManager()
        
        # Add some providers
        manager._providers["prov1"] = Mock()
        manager._providers["prov2"] = Mock()
        manager._providers["prov3"] = Mock()
        
        fallback = manager.fallback_provider("prov1")
        assert fallback == "prov2"  # Next in list
    
    def test_fallback_nonexistent_provider(self):
        """Test fallback for non-existent provider."""
        manager = ProviderManager()
        
        manager._providers["prov1"] = Mock()
        
        fallback = manager.fallback_provider("nonexistent")
        assert fallback == "prov1"  # First available

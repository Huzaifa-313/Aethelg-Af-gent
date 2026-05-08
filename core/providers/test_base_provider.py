"""
Tests for BaseProvider with Self-Evolution Features
"""

import pytest
from unittest.mock import Mock, patch
from core.providers.base import BaseProvider, ProviderError, ModelNotFoundError

class MockProvider(BaseProvider):
    """Mock provider for testing."""
    def list_models(self):
        return ["test-model-1", "test-model-2"]
    
    def chat_completion(self, model, messages, **kwargs):
        return {"response": "test response"}

class TestBaseProvider:
    """Test suite for BaseProvider."""
    
    def test_initialization(self):
        """Test provider initialization."""
        config = {
            "name": "TestProvider",
            "api_key": "test-key",
            "endpoint": "https://test.com/v1",
            "requires_proxy": False
        }
        provider = MockProvider(config)
        assert provider.name == "TestProvider"
        assert provider.api_key == "test-key"
        assert provider.endpoint == "https://test.com/v1"
        assert provider.requires_proxy == False
    
    def test_health_check_success(self):
        """Test successful health check."""
        config = {"name": "TestProvider"}
        provider = MockProvider(config)
        # Mock list_models to succeed
        provider.list_models = Mock(return_value=["model1"])
        assert provider.health_check() == True
    
    def test_health_check_failure(self):
        """Test health check failure."""
        config = {"name": "TestProvider"}
        provider = MockProvider(config)
        # Mock list_models to raise exception
        provider.list_models = Mock(side_effect=Exception("Connection failed"))
        assert provider.health_check() == False
    
    def test_record_failure(self):
        """Test failure recording."""
        config = {"name": "TestProvider"}
        provider = MockProvider(config)
        initial_failure_count = provider.failure_count
        provider.record_failure(Exception("Test error"))
        assert provider.failure_count == initial_failure_count + 1
        assert provider.last_failure_time > 0
    
    def test_record_success(self):
        """Test success recording."""
        config = {"name": "TestProvider"}
        provider = MockProvider(config)
        initial_success_count = provider.success_count
        provider.record_success()
        assert provider.success_count == initial_success_count + 1
        assert provider.last_success_time > 0
    
    def test_performance_score_update(self):
        """Test performance score calculation."""
        config = {"name": "TestProvider"}
        provider = MockProvider(config)
        # Record some successes and failures
        for _ in range(7):
            provider.record_success()
        for _ in range(3):
            provider.record_failure(Exception("test"))
        
        # 7 successes out of 10 total = 70% success rate
        # With exponential smoothing: 1.0 * 0.7 + 0.7 * 0.3 = 0.91
        assert 0.8 < provider.performance_score < 1.0
    
    def test_temporary_disable(self):
        """Test temporary provider disabling."""
        config = {"name": "TestProvider"}
        provider = MockProvider(config)
        # Simulate many failures
        for _ in range(6):
            provider.record_failure(Exception("test failure"))
        
        assert provider.is_temporarily_disabled == True
        assert provider.disabled_until > 0
    
    def test_provider_availability(self):
        """Test provider availability check."""
        config = {"name": "TestProvider"}
        provider = MockProvider(config)
        assert provider.is_available() == True
        
        # Disable provider
        provider.is_temporarily_disabled = True
        provider.disabled_until = 9999999999  # Far future
        assert provider.is_available() == False
    
    def test_get_provider_stats(self):
        """Test getting provider statistics."""
        config = {"name": "TestProvider"}
        provider = MockProvider(config)
        provider.record_success()
        provider.record_failure(Exception("test"))
        
        stats = provider.get_provider_stats()
        assert "name" in stats
        assert "success_count" in stats
        assert "failure_count" in stats
        assert "performance_score" in stats
        assert stats["name"] == "TestProvider"
    
    def test_failure_pattern_tracking(self):
        """Test failure pattern tracking."""
        config = {"name": "TestProvider"}
        provider = MockProvider(config)
        
        # Record different types of failures
        provider.record_failure(ConnectionError("connection failed"))
        provider.record_failure(ConnectionError("another connection issue"))
        provider.record_failure(ValueError("invalid value"))
        
        assert "ConnectionError" in provider.failure_patterns
        assert "ValueError" in provider.failure_patterns
        assert provider.failure_patterns["ConnectionError"] == 2
        assert provider.failure_patterns["ValueError"] == 1

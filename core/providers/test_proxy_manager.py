"""
Tests for ProxyManager
"""

import pytest
from unittest.mock import Mock, patch, MagicMock
from pathlib import Path
from core.providers.proxy_manager import ProxyManager

class TestProxyManager:
    """Test suite for ProxyManager."""
    
    def setup_method(self):
        """Set up for each test."""
        # Mock the hunter module
        self.mock_hunter = Mock()
        self.mock_hunter.search_and_install = Mock(return_value={"success": True})
    
    def test_initialization(self):
        """Test proxy manager initialization."""
        with patch("core.providers.proxy_manager.hunter", self.mock_hunter):
            manager = ProxyManager()
            assert manager is not None
            assert hasattr(manager, 'proxies')
    
    def test_load_proxy_list(self):
        """Test loading proxy list from YAML."""
        # Create a temporary proxy list file
        proxy_yaml = """
proxies:
  test_proxy:
    protocol: http
    host: 127.0.0.1
    port: 8080
    username: user
    password: pass
"""
        proxy_path = Path("core/providers/proxy_list.yaml")
        proxy_path.parent.mkdir(parents=True, exist_ok=True)
        
        with open(proxy_path, 'w') as f:
            f.write(proxy_yaml)
        
        with patch("core.providers.proxy_manager.hunter", self.mock_hunter):
            manager = ProxyManager()
            assert "test_proxy" in manager.proxies
    
    def test_get_proxy_for_provider(self):
        """Test getting proxy for a provider."""
        proxy_yaml = """
proxies:
  test_provider:
    protocol: socks5
    host: proxy.example.com
    port: 1080
    username: user
    password: pass
"""
        proxy_path = Path("core/providers/proxy_list.yaml")
        with open(proxy_path, 'w') as f:
            f.write(proxy_yaml)
        
        with patch("core.providers.proxy_manager.hunter", self.mock_hunter):
            manager = ProxyManager()
            proxy = manager.get_proxy_for_provider("test_provider")
            
            assert proxy is not None
            assert "http" in proxy
            assert "socks5://" in proxy["http"]
            assert "proxy.example.com:1080" in proxy["http"]
    
    def test_get_proxy_fallback(self):
        """Test fallback to default proxy."""
        proxy_yaml = """
proxies:
  default_http:
    protocol: http
    host: default.proxy.com
    port: 8080
"""
        proxy_path = Path("core/providers/proxy_list.yaml")
        with open(proxy_path, 'w') as f:
            f.write(proxy_yaml)
        
        with patch("core.providers.proxy_manager.hunter", self.mock_hunter):
            manager = ProxyManager()
            # Request proxy for non-existent provider
            proxy = manager.get_proxy_for_provider("nonexistent")
            
            assert proxy is not None
            assert "default.proxy.com" in proxy["http"]
    
    def test_trigger_hunter_for_proxy(self):
        """Test triggering hunter to find proxy."""
        with patch("core.providers.proxy_manager.hunter", self.mock_hunter):
            manager = ProxyManager()
            result = manager.trigger_hunter_for_proxy("test_provider")
            
            assert result == True
            self.mock_hunter.search_and_install.assert_called_once()
    
    def test_log_proxy_setup(self):
        """Test logging proxy setup messages."""
        with patch("core.providers.proxy_manager.hunter", self.mock_hunter):
            manager = ProxyManager()
            manager.log_proxy_setup("Test message")
            
            log_path = Path("core/system/proxy_setup.log")
            assert log_path.exists()
            
            with open(log_path, 'r') as f:
                content = f.read()
                assert "Test message" in content
    
    def test_get_proxy_stats(self):
        """Test getting proxy statistics."""
        proxy_yaml = """
proxies:
  test_provider:
    protocol: http
    host: test.com
    port: 8080
"""
        proxy_path = Path("core/providers/proxy_list.yaml")
        with open(proxy_path, 'w') as f:
            f.write(proxy_yaml)
        
        with patch("core.providers.proxy_manager.hunter", self.mock_hunter):
            manager = ProxyManager()
            stats = manager.get_proxy_stats("test_provider")
            
            assert "current_proxy" in stats
    
    def test_get_proxy_health(self):
        """Test checking proxy health."""
        with patch("core.providers.proxy_manager.hunter", self.mock_hunter):
            manager = ProxyManager()
            health = manager.get_proxy_health("test_provider")
            
            assert "status" in health

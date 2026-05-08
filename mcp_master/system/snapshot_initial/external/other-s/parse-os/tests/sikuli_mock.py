from os_automation.repos.sikuli_adapter import SikuliAdapter

adapter = SikuliAdapter()
adapter.execute({"bbox": [20,20,80,40], "event": "type", "text": "hello"})


# ✅ Should print: [Sikuli] type at (60,40): hello
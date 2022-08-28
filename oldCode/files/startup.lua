--local http = require("socket.http")
--local body, code, headers, status = http.request("https://www.google.com")
--print(code, status, #body)

--http = 
local request = http.get("127.0.0.1")
print(request)

--os.reboot()
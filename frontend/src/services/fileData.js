const sampleFiles = {
	"/main.py": {
		id: "1",
		name: "main.py",
		path: "/main.py",
		content: "print('hello world')\n",
		type: "file",
		language: "python",
	},
	"/boot.py": {
		id: "1",
		name: "boot.py",
		path: "/boot.py",
		content: "print('boot file')\n",
		type: "file",
		language: "python",
	},
	"/config.py": {
		id: "2",
		name: "config.py",
		path: "/config.py",
		content: "WIFI_SSID = 'MyNetwork'\nWIFI_PASSWORD = 'secret123'\n",
		type: "file",
		language: "python",
	},
	"/services/wifi.py": {
		id: "3",
		name: "wifi.py",
		path: "/services/wifi.py",
		content: "def connect():\n    pass\n",
		type: "file",
		language: "python",
	},
	"/services/websocket_client.py": {
		id: "4",
		name: "websocket_client.py",
		path: "/services/websocket_client.py",
		content: "def send(msg):\n    pass\n",
		type: "file",
		language: "python",
	},
	"/lib/utils.py": {
		id: "5",
		name: "utils.py",
		path: "/lib/utils.py",
		content: "def read_json(path):\n    pass\n",
		type: "file",
		language: "python",
	},
};

// Tree shape for FileManager. `path` is included on every node so it lines
// up 1:1 with sampleFiles' keys, and with what read_folder() returns for a
// real device (path.rstrip("/") + "/" + name).
const file = [
	{ name: "main.py", path: "/main.py", type: "file" },
	{ name: "config.py", path: "/config.py", type: "file" },
	{
		name: "services",
		path: "/services",
		type: "folder",
		children: [
			{ name: "wifi.py", path: "/services/wifi.py", type: "file" },
			{ name: "websocket_client.py", path: "/services/websocket_client.py", type: "file" },
		],
	},
	{
		name: "lib",
		path: "/lib",
		type: "folder",
		children: [{ name: "utils.py", path: "/lib/utils.py", type: "file" }],
	},
];

// Usage in the parent that owns activeFile:
//   const handleFileSelect = (path) => setActiveFile(sampleFiles[path]);
//   <FileExplorer files={file} activeFile={activeFile} onFileSelect={handleFileSelect} ... />

export { sampleFiles, file };
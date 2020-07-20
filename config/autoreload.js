module.exports.autoreload = {
	active: true,
	usePolling: false,
	overrideMigrateSetting: false,
	dirs: [
	  "api/models",
	  "api/controllers",
	  "api/services",
	  "config"
	],
	ignored: [
	  // Ignore all files with .ts extension
		"**.ts",
		"/data.db",
		"**.zip",
		"photos/*",
		"thumbs/*"
	]
  };

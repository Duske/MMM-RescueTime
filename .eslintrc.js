module.exports = {
	"rules": {
		"indent": ["error", "tab"],
		"quotes": ["error", "double"],
		"max-len": ["error", 250],
		"curly": "error",
		"camelcase": ["error", {"properties": "never"}]
	},
	"env": {
		"browser": true,
		"node": true,
		"es6": true
	}
};
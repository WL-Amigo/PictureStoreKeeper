package Model

import (
	"os"
	"strings"
)

type Settings struct {
	AllowCrossOriginAccess bool
	EnableLogging          bool
	IndentData             bool
	RootDir                string
}

const allowCrossOriginAccessKey = "PSK_ALLOW_CROSS_ORIGIN_ACCESS"
const enableLoggingKey = "PSK_ENABLE_LOGGING"
const indentDataKey = "PSK_INDENT_DATA"
const rootDirKey = "PSK_ROOT_DIR"

func LoadSettings() *Settings {
	ret := new(Settings)

	// mapping environment
	ret.AllowCrossOriginAccess = loadBooleanEnvironmentValue(allowCrossOriginAccessKey)
	ret.EnableLogging = loadBooleanEnvironmentValue(enableLoggingKey)
	ret.IndentData = loadBooleanEnvironmentValue(indentDataKey)
	ret.RootDir = os.Getenv(rootDirKey)
	if ret.RootDir == "" {
		homeDir, err := os.UserHomeDir()
		if err != nil {
			panic(err)
		}
		ret.RootDir = homeDir
	}

	return ret
}

func loadBooleanEnvironmentValue(key string) bool {
	value := os.Getenv(key)
	if strings.ToLower(value) == "true" {
		return true
	}
	return false
}

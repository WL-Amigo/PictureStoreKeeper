package Model

import (
	"os"
	"strconv"
	"strings"
)

type Settings struct {
	AllowCrossOriginAccess bool
	EnableLogging          bool
	IndentData             bool
	RootDir                string
	MaxJobCount            int
}

const allowCrossOriginAccessKey = "PSK_ALLOW_CROSS_ORIGIN_ACCESS"
const enableLoggingKey = "PSK_ENABLE_LOGGING"
const indentDataKey = "PSK_INDENT_DATA"
const rootDirKey = "PSK_ROOT_DIR"
const maxJobCountKey = "PSK_MAX_JOB_COUNT"

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
	ret.MaxJobCount = loadIntEnvironmentValue(maxJobCountKey)
	if ret.MaxJobCount <= 0 {
		ret.MaxJobCount = 4
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

func loadIntEnvironmentValue(key string) int {
	rawValue := os.Getenv(key)
	value, err := strconv.ParseInt(rawValue, 10, 32)
	if err != nil {
		return 0
	}
	return int(value)
}

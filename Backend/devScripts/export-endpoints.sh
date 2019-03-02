go run ./ListEndpoints.go | jq -r '[.[] | select( .method == "GET" or .method == "POST" ) | select( .name | contains("github.com/labstack/echo") | not ) | "\(.path) : \(.method)"] | sort | .[]'

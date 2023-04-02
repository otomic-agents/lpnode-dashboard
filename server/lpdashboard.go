package lpdashboardapi

import (
	"context"
	"log"
	lpdashboard "lpdashboard/gen/lpdashboard"

	"crypto/tls"
	"bytes"
    "encoding/json"
    "io"
    "io/ioutil"
    "net/http"
    "time"
)

// lpdashboard service example implementation.
// The example methods log the requests and return zero values.
type lpdashboardsrvc struct {
	logger *log.Logger
	windowMap *map[string]string
}


// Newlpdashboard returns the lpdashboard service implementation.
func NewLpdashboard(logger *log.Logger) lpdashboard.Service {
	var windowMapObj = make(map[string]string)
	var windowMapObj_p = &windowMapObj
	return &lpdashboardsrvc{logger, windowMapObj_p,}
}
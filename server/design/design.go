package design

import (
	. "goa.design/goa/v3/dsl"
)

var _ = API("lpdashboard", func() {
	Title("LPDashboard Service")
	Description("LP-Dashboard services")
    Server("lpdashboard", func() {
        Host("0.0.0.0", func() {
            URI("http://0.0.0.0:9000")
            URI("grpc://0.0.0.0:9001")
			// URI("http://0.0.0.0:30101")
            // URI("grpc://0.0.0.0:30102")
        })
    })
})

var _ = Service("lpdashboard", func() {
	Description("LP-Dashboard  services")

	Files("/openapi.json", "./gen/http/openapi.json")
	Files("/", "./website/index.html")
	Files("/_app.config.js", "./website/_app.config.js")
	Files("/favicon.ico", "./website/favicon.ico")
	Files("/assets/{*filepath}", "./website/assets")
	Files("/resource/{*filepath}", "./website/resource")
})
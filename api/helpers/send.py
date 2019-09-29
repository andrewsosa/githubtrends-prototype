import json

def send_json(handler, body):
    """ Return status 200 and serialize body to JSON string """
    handler.send_response(200)
    handler.send_header("Content-Type", 'application/json')
    handler.end_headers()
    handler.wfile.write(json.dumps(body).encode())



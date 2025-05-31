import json
from functions.support import support

def lambda_handler(event, context):

    method = event["requestContext"]["http"]["method"]
    path = event["requestContext"]["http"]["path"]
    
    body = {}
    if 'body' in event and event['body'] is not None: body = event['body']
    
    if isinstance(body, str): body = json.loads(event['body']) # to convert to json when from JS or Postman

    ret = "No response"

    if (path == "/support") & (method == "POST"):
        ret = support(body)
    
    else:
        return {
            'statusCode': 400,
            'body': 'Bad Request'
        }
            
    resp = ret
    
    return {
         'statusCode': 200,
         'body': resp
    }
     
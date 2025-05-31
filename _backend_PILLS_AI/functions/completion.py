import os 
from openai import OpenAI

def completion(messages, language):
    
    if language == "en": 
        messages.append({ "role": "system", "content": "Write the texts in English." })
    elif language == "pt":
        messages.append({ "role": "system", "content": "Escreva os textos em português." })
    elif language == "es":
        messages.append({ "role": "system", "content": "Escriba los textos en español." })
    elif language == "te":
        messages.append({ "role": "system", "content": "పాఠాలను తెలుగులో రాయండి" })
    
    model = "qwen-plus" 
        
    client = OpenAI(api_key=os.getenv('API_KEY_QWEN'), base_url="https://dashscope-intl.aliyuncs.com/compatible-mode/v1")
    chat_completion = client.chat.completions.create(
        messages=messages,
        temperature=0.7,
        model=model,
        response_format={ "type": "json_object" },
    )
    resp = chat_completion.choices[0].message.content
    
    return resp
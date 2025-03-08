from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import datetime
from main import TranslationBST

import dictionary_management
import file_upload

app = Flask(__name__)
CORS(app)  

english_tree = TranslationBST()
french_tree = TranslationBST()

recent_additions = []

stats = {
    "totalWords": 0,
    "englishWords": 0,
    "frenchWords": 0,
    "averageTranslationsPerWord": 1.0,
    "lastUpdated": datetime.datetime.now().isoformat()
}

def add_sample_data():
    sample_pairs = [
        ("hello", "bonjour"),
        ("goodbye", "au revoir"),
        ("thanks", "merci"),
        ("please", "s'il vous plaît"),
        ("yes", "oui"),
        ("no", "non"),
        ("good morning", "bonjour"),
        ("good evening", "bonsoir"),
        ("good night", "bonne nuit"),
        ("how are you", "comment allez-vous")
    ]
    
    for english, french in sample_pairs:
        english_tree.insert(english, french)
        french_tree.insert(french, english)
        
        recent_additions.append({
            "word": english,
            "translation": french,
            "date": (datetime.datetime.now() - datetime.timedelta(days=len(recent_additions) % 5)).isoformat()
        })


dictionary_management.initialize(english_tree, french_tree, recent_additions, stats)
file_upload.initialize(english_tree, french_tree, recent_additions)


app.register_blueprint(dictionary_management.dictionary_bp)
app.register_blueprint(file_upload.file_upload_bp)

@app.route('/')
def home():
    return jsonify({
        "status": "online",
        "message": "Translation API is running",
        "endpoints": {
            "translate": "/translate?word=<word>&fromLang=<english|french>"
        }
    })

@app.route('/translate', methods=['GET'])
def translate():
    word = request.args.get('word', '').lower()
    from_lang = request.args.get('fromLang', '')
    
    if not word or not from_lang:
        return jsonify({"error": "Word and language direction are required"}), 400
    
    tree = french_tree if from_lang == 'french' else english_tree
    translations = tree.search(word)
    
    if translations:
        return jsonify({"translations": list(translations)})
    else:
        return jsonify({"translations": []})

if __name__ == '__main__':
    
    add_sample_data()
    

    dictionary_management.update_statistics()
    
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
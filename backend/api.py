# api.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import tempfile
import datetime
from werkzeug.utils import secure_filename
import csv
import openpyxl
from datetime import datetime, timedelta


from main import  TranslationBST

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
    "lastUpdated": datetime.now().isoformat()
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
            "date": (datetime.now() - timedelta(days=len(recent_additions) % 5)).isoformat()
        })
    

def count_nodes(node):
    if node is None:
        return 0
    return 1 + count_nodes(node.left) + count_nodes(node.right)

def count_translations(node):
    if node is None:
        return 0, 0
    
    total_translations = len(node.values)
    node_count = 1
    
    left_translations, left_nodes = count_translations(node.left)
    right_translations, right_nodes = count_translations(node.right)
    
    return total_translations + left_translations + right_translations, node_count + left_nodes + right_nodes

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

@app.route('/word', methods=['POST', 'DELETE'])
def manage_word():
    if request.method == 'POST':
        data = request.json
        word = data.get('word', '').lower()
        translation = data.get('translation', '').lower()
        from_lang = data.get('fromLang', '')
        
        if not word or not translation or not from_lang:
            return jsonify({"error": "Word, translation, and language direction are required"}), 400
        
        if from_lang == 'french':
            french_tree.insert(word, translation)
            english_tree.insert(translation, word)
        else:
            english_tree.insert(word, translation)
            french_tree.insert(translation, word)
        
        recent_additions.append({
            "word": word,
            "translation": translation,
            "date": datetime.now().isoformat()
        })
        
        if len(recent_additions) > 100:
            recent_additions.pop(0)
        

        return jsonify({"success": True})
    
    elif request.method == 'DELETE':
        word = request.args.get('word', '').lower()
        from_lang = request.args.get('fromLang', '')
        
        if not word or not from_lang:
            return jsonify({"error": "Word and language direction are required"}), 400
        
        tree = french_tree if from_lang == 'french' else english_tree
        translations = tree.search(word)
        
        if translations:
            if from_lang == 'french':
                for trans in translations:
                    english_tree.root = delete_node(english_tree.root, trans, word)
                
                french_tree.root = delete_node(french_tree.root, word, None)
            else:
                for trans in translations:
                    french_tree.root = delete_node(french_tree.root, trans, word)
                
                english_tree.root = delete_node(english_tree.root, word, None)
            

            return jsonify({"success": True})
        else:
            return jsonify({"error": "Word not found"}), 404

def delete_node(root, key, specific_value=None):
    if root is None:
        return None
    

    if key < root.key:
        root.left = delete_node(root.left, key, specific_value)
    elif key > root.key:
        root.right = delete_node(root.right, key, specific_value)
    else:
        if specific_value is not None:
            if specific_value in root.values:
                root.values.remove(specific_value)
                if not root.values:
                    return delete_node_completely(root)
        else:
            return delete_node_completely(root)
    
    return root


def delete_node_completely(node):
    
    if node.left is None and node.right is None:
        return None
    
    if node.left is None:
        return node.right
    if node.right is None:
        return node.left
    

    successor = find_min(node.right)
    node.key = successor.key
    node.values = successor.values
    node.right = delete_node(node.right, successor.key)
    
    return node

def find_min(node):
    current = node
    while current.left is not None:
        current = current.left
    return current


@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    file_ext = os.path.splitext(file.filename)[1].lower()
    if file_ext not in ['.xlsx', '.xls', '.csv', '.txt']:
        return jsonify({"error": "Invalid file type"}), 400
    
    filename = secure_filename(file.filename)
    temp_dir = tempfile.mkdtemp()
    file_path = os.path.join(temp_dir, filename)
    file.save(file_path)
    
    try:
        word_pairs = []
        
        if file_ext in ['.xlsx', '.xls']:
            wb = openpyxl.load_workbook(file_path)
            sheet = wb.active
            for row in sheet.iter_rows(min_row=2, values_only=True):
                english, french = row[:2]
                if english and french:
                    word_pairs.append((str(english).lower(), str(french).lower()))
                    
        elif file_ext == '.csv':
            with open(file_path, mode='r', encoding='utf-8') as f:
                reader = csv.reader(f)
                for row in reader:
                    if len(row) >= 2:
                        english, french = row[:2]
                        if english and french:
                            word_pairs.append((str(english).lower(), str(french).lower()))
                            
        elif file_ext == '.txt':
            with open(file_path, mode='r', encoding='utf-8') as f:
                for line in f:
                    line = line.strip()
                    if '=' in line:
                        english, french = line.split('=')
                        if english and french:
                            word_pairs.append((english.strip().lower(), french.strip().lower()))
        
        for english, french in word_pairs:
            english_tree.insert(english, french)
            french_tree.insert(french, english)
            
           
            if len(recent_additions) < 100: 
                recent_additions.append({
                    "word": english,
                    "translation": french,
                    "date": datetime.now().isoformat()
                })
        

        return jsonify({
            "success": True,
            "wordCount": len(word_pairs),
            "message": f"Successfully imported {len(word_pairs)} word pairs."
        })
        
    except Exception as e:
        return jsonify({
            "error": f"Error processing file: {str(e)}"
        }), 500
    finally:

        try:
            os.remove(file_path)
            os.rmdir(temp_dir)
        except:
            pass


if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
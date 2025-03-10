from flask import Blueprint, request, jsonify
from main import TranslationBST
import datetime

dictionary_bp = Blueprint('dictionary', __name__)

english_tree = None
french_tree = None
recent_additions = None


def initialize(eng_tree, fr_tree, additions):
    """Initialize the module with shared data structures from api.py"""
    global english_tree, french_tree, recent_additions
    english_tree = eng_tree
    french_tree = fr_tree
    recent_additions = additions
    

def count_translations(node):
    """Count the total number of translations and nodes in a tree"""
    if node is None:
        return 0, 0
    
    total_translations = len(node.values)
    node_count = 1
    
    left_translations, left_nodes = count_translations(node.left)
    right_translations, right_nodes = count_translations(node.right)
    
    return total_translations + left_translations + right_translations, node_count + left_nodes + right_nodes

@dictionary_bp.route('/word', methods=['POST', 'DELETE'])
def manage_word():
    """Add, modify, or delete a word from the dictionary"""
    global english_tree, french_tree, recent_additions
    
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
            "date": datetime.datetime.now().isoformat()
        })
        
        if len(recent_additions) > 100:
            recent_additions.pop(0)
        
    
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
            
        else:
            return jsonify({"error": "Word not found"}), 404

def delete_node(root, key, specific_value=None):
    """Delete a node or a specific value from a node in the tree"""
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
    """Completely remove a node from the tree"""
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
    """Find the node with the minimum key in a subtree"""
    current = node
    while current.left is not None:
        current = current.left
    return current


@dictionary_bp.route('/dictionary/recent', methods=['GET'])
def get_recent():
    """Get recently added words"""
    global recent_additions
    return jsonify(recent_additions)
from flask import Blueprint, request, jsonify
import os
import tempfile
import datetime
from werkzeug.utils import secure_filename
import csv
import openpyxl
from main import TranslationBST

file_upload_bp = Blueprint('file_upload', __name__)

english_tree = None
french_tree = None
recent_additions = None

def initialize(eng_tree, fr_tree, additions):
    """Initialize the module with shared data structures from api.py"""
    global english_tree, french_tree, recent_additions
    english_tree = eng_tree
    french_tree = fr_tree
    recent_additions = additions

@file_upload_bp.route('/upload', methods=['POST'])
def upload_file():
    """Upload a file containing word pairs to add to the dictionary"""
    global english_tree, french_tree, recent_additions
    
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
            word_pairs = process_excel_file(file_path)
        elif file_ext == '.csv':
            word_pairs = process_csv_file(file_path)
        elif file_ext == '.txt':
            word_pairs = process_txt_file(file_path)
        

        for english, french in word_pairs:
            english_tree.insert(english, french)
            french_tree.insert(french, english)
            
            if len(recent_additions) < 100: 
                recent_additions.append({
                    "word": english,
                    "translation": french,
                    "date": datetime.datetime.now().isoformat()
                })
        
        sample_words = word_pairs[:5] if word_pairs else []
        
        return jsonify({
            "success": True,
            "wordCount": len(word_pairs),
            "message": f"Successfully imported {len(word_pairs)} word pairs.",
            "sampleWords": sample_words
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

def process_excel_file(file_path):
    """Extract word pairs from Excel file"""
    word_pairs = []
    
    try:
        wb = openpyxl.load_workbook(file_path)
        sheet = wb.active
        
    
        print(f"Processing Excel file: {file_path}")
        print(f"Sheet name: {sheet.title}")
        print(f"Dimensions: {sheet.dimensions}")
        
        row_count = 0
        pair_count = 0
        
    
        for row in sheet.iter_rows(min_row=2, values_only=True):
            row_count += 1
            
            if len(row) < 2:
                print(f"Skipping row {row_count}: Not enough columns")
                continue
                

            french, english = row[:2]
            
            if french and english:
                french_str = str(french).lower().strip()
                english_str = str(english).lower().strip()
                
                word_pairs.append((english_str, french_str))
                pair_count += 1
                print(f"Added pair: {english_str} = {french_str}")
            else:
                print(f"Skipping row {row_count}: Empty value(s)")
        
        print(f"Total rows processed: {row_count}")
        print(f"Total pairs added: {pair_count}")
        
    except Exception as e:
        print(f"Error processing Excel file: {str(e)}")
        raise
        
    return word_pairs

def process_csv_file(file_path, encoding='utf-8'):
    """Extract word pairs from CSV file"""
    word_pairs = []
    
    try:
        with open(file_path, mode='r', encoding=encoding) as file:
            reader = csv.reader(file)
            for row in reader:
                if len(row) >= 2:
                    english, french = row[:2]
                    if english and french:
                        word_pairs.append((str(english).lower(), str(french).lower()))
    except UnicodeDecodeError:
        with open(file_path, mode='r', encoding='latin1') as file:
            reader = csv.reader(file)
            for row in reader:
                if len(row) >= 2:
                    english, french = row[:2]
                    if english and french:
                        word_pairs.append((str(english).lower(), str(french).lower()))
    
    return word_pairs

def process_txt_file(file_path):
    """Extract word pairs from text file (format: english=french)"""
    word_pairs = []
    
   
    encodings = ['utf-8', 'latin1', 'cp1252']
    success = False
    
    for encoding in encodings:
        try:
            with open(file_path, mode='r', encoding=encoding) as file:
                for line_num, line in enumerate(file, 1):
                    try:
                        line = line.strip()
                        if not line: 
                            continue
                            
                        if '=' in line:
                            parts = line.split('=', 1)  
                            if len(parts) == 2:
                                english, french = parts
                                if english.strip() and french.strip():
                                    word_pairs.append((english.strip().lower(), french.strip().lower()))
                                else:
                                    print(f"Ligne {line_num}: Partie vide dans '{line}'")
                        else:
                            print(f"Ligne {line_num}: Format incorrect '{line}' (pas de signe =)")
                    except Exception as e:
                        print(f"Erreur ligne {line_num}: {str(e)}")

            success = True
            break
        except UnicodeDecodeError:
            continue
        except Exception as e:
            print(f"Erreur de lecture du fichier: {str(e)}")
            break
    
    if not success:
        print("Impossible de lire le fichier avec les encodages disponibles")
    
    print(f"Nombre de paires de mots trouvées: {len(word_pairs)}")
    return word_pairs


import openpyxl

class TreeNode:
    """Represent a node in the BST."""
    def __init__(self, key, value):
        self.key = key.lower()
        self.values = {value.lower()}  
        self.left = None
        self.right = None

    def add_translation(self, value):
        """Add a translation to an existing value"""
        self.values.add(value.lower())

class TranslationBST:
    """Binary tree to stock translation"""
    def __init__(self):
        self.root = None

    def insert(self, key, value):
        """add a word and it's transaltion in the tree, managing homonyms"""
        self.root = self._insert_recursive(self.root, key, value)

    def _insert_recursive(self, node, key, value):
        if node is None:
            return TreeNode(key, value)
        if key < node.key:
            node.left = self._insert_recursive(node.left, key, value)
        elif key > node.key:
            node.right = self._insert_recursive(node.right, key, value)
        else:
            node.add_translation(value)  
        return node

    def search(self, key):
        """search a word and returns all the translatiosn"""
        node = self._search_recursive(self.root, key)
        return node.values if node else None

    def _search_recursive(self, node, key):
        if node is None or node.key == key:
            return node
        if key < node.key:
            return self._search_recursive(node.left, key)
        return self._search_recursive(node.right, key)

    def batch_insert(self, word_pairs, is_english=True):
        """upload miltiple words from a file"""
        for english, french in word_pairs:
            if is_english:
                self.insert(english, french)
            else:
                self.insert(french, english)
                
    def delete(self, key):
        """delete a word and it's translation from the tree"""
        self.root = self._delete_recursive(self.root, key)
                
    def _delete_recursive(self, node, key):
        """delete a node from the tree."""
        if not node:
            return None
        if key < node.key:
            node.left = self._delete_recursive(node.left, key)
        elif key > node.key:
            node.right = self._delete_recursive(node.right, key)
        else:
            if not node.left:
                return node.right
            if not node.right:
                return node.left

            min_larger_node = self._find_min(node.right)
            node.key, node.values = min_larger_node.key, min_larger_node.values
            node.right = self._delete_recursive(node.right, min_larger_node.key)

        return node

    def _find_min(self, node):
        while node.left:
            node = node.left
        return node
        
    def get_height(self):
        return self._get_height_recursive(self.root)
        
    def _get_height_recursive(self, node):
        if not node:
            return 0
        return 1 + max(self._get_height_recursive(node.left), self._get_height_recursive(node.right))
        
    def get_predecessor(self, key):
        node = self._search_recursive(self.root, key)
        if not node:
            return None
            
        if node.left:
            return self._find_max(node.left).key
            
        return self._find_predecessor_ancestor(self.root, key)
        
    def _find_max(self, node):
        while node.right:
            node = node.right
        return node
        
    def _find_predecessor_ancestor(self, node, key, predecessor=None):
        if not node:
            return predecessor
            
        if key < node.key:
            return self._find_predecessor_ancestor(node.left, key, predecessor)
        elif key > node.key:
            return self._find_predecessor_ancestor(node.right, key, node.key)
        else:
            return predecessor
            
    def get_successor(self, key):
        node = self._search_recursive(self.root, key)
        if not node:
            return None
            
        if node.right:
            return self._find_min(node.right).key
            
        return self._find_successor_ancestor(self.root, key)
        
    def _find_successor_ancestor(self, node, key, successor=None):
        if not node:
            return successor
            
        if key < node.key:
            return self._find_successor_ancestor(node.left, key, node.key)
        elif key > node.key:
            return self._find_successor_ancestor(node.right, key, successor)
        else:
            return successor
            
    def inorder_traversal(self):
        result = []
        self._inorder_traversal_recursive(self.root, result)
        return result
        
    def _inorder_traversal_recursive(self, node, result):
        if node:
            self._inorder_traversal_recursive(node.left, result)
            result.append((node.key, node.values))
            self._inorder_traversal_recursive(node.right, result)


def load_from_excel(file_path):
    word_pairs = []
    wb = openpyxl.load_workbook(file_path)
    sheet = wb.active
    for row in sheet.iter_rows(min_row=2, values_only=True):
        english, french = row[:2]
        if english and french:
            word_pairs.append((str(english).lower(), str(french).lower()))
    return word_pairs

def load_from_txt(file_path):
    word_pairs = []
    with open(file_path, mode='r', encoding='utf-8') as file:
        for line in file:
            line = line.strip()
            if '=' in line:
                english, french = line.split('=')
                if english and french:
                    word_pairs.append((english.strip().lower(), french.strip().lower()))
    return word_pairs


english_tree = TranslationBST()
french_tree = TranslationBST()

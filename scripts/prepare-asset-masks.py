"""Trace display-only SVG masks. Source JPEG artwork is copied unchanged."""
from pathlib import Path
import json
import shutil
import cv2
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'download'
DEST = ROOT / 'public' / 'assets'
DEST.mkdir(parents=True, exist_ok=True)

files = {
    'pizza-margherita': 'Neapolitan_Margherita',
    'pizza-pepperoni': 'Create_pepperoni_pizza',
    'pizza-four-cheese': 'Create_Four_Cheese',
    'pizza-veggie': 'Neapolitan_veggie',
    'basil': 'Basil_leaf',
    'mozzarella': 'Mozzarella_piece',
    'tomato': 'Tomato_ingredient',
    'pepperoni': 'Create_pepperoni_slice',
    'mushroom': 'Mushroom_slice',
    'olive': 'Black_olive',
    'onion': 'Red_onion',
    'chilli': 'Red_chili',
    'chilli-flakes': 'Chili_flake',
    'seasoning': 'Flour_dust',
}
metadata_path = ROOT / 'lib' / 'asset-masks.json'
metadata = json.loads(metadata_path.read_text(encoding='utf-8')) if metadata_path.exists() else {}
for name, prefix in files.items():
    source = next(SOURCE.glob(prefix + '*.jpg'))
    shutil.copyfile(source, DEST / (name + '.jpg'))
    if name in metadata or name not in ['pizza-margherita', 'pizza-pepperoni', 'pizza-four-cheese', 'pizza-veggie', 'basil', 'mozzarella', 'tomato', 'seasoning', 'pepperoni', 'mushroom', 'chilli', 'onion']:
        continue
    img = cv2.imdecode(np.frombuffer(source.read_bytes(), np.uint8), cv2.IMREAD_COLOR)
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    if name.startswith('pizza-'):
        labels = np.zeros(img.shape[:2], np.uint8)
        rect = {'pizza-margherita': (252, 104, 690, 680), 'pizza-four-cheese': (223, 77, 747, 742)}.get(name, (185, 35, 825, 820))
        cv2.grabCut(img, labels, rect, np.zeros((1,65)), np.zeros((1,65)), 6, cv2.GC_INIT_WITH_RECT)
        mask = np.uint8((labels == 1) | (labels == 3)) * 255
    elif name == 'basil':
        mask = np.uint8((hsv[:,:,1] > 55) & (hsv[:,:,0] > 25) & (hsv[:,:,0] < 95)) * 255
    elif name == 'mozzarella':
        mask = np.uint8(hsv[:,:,2] > 150) * 255
        mask[:180] = 0
        mask[740:] = 0
        mask[:,:230] = 0
        mask[:,950:] = 0
    elif name == 'tomato':
        mask = np.uint8(hsv[:,:,1] > 90) * 255
    elif name in ['pepperoni', 'chilli']:
        mask = np.uint8(hsv[:,:,1] > 45) * 255
    elif name == 'mushroom':
        mask = np.uint8(hsv[:,:,2] > 145) * 255
        mask[:90] = 0
        mask[800:] = 0
        mask[:,:210] = 0
        mask[:,970:] = 0
    elif name == 'onion':
        mask = np.uint8((hsv[:,:,1] > 8) & (hsv[:,:,0] > 105)) * 255
    else:
        mask = np.uint8((hsv[:,:,1] > 32) & (hsv[:,:,2] > 45)) * 255
        mask[:145] = 0
        mask[770:] = 0
        mask[:,:290] = 0
        mask[:,920:] = 0
    if name != 'seasoning':
        mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, np.ones((5,5), np.uint8))
    retrieval = cv2.RETR_CCOMP if name == 'onion' else cv2.RETR_EXTERNAL
    contours, hierarchy = cv2.findContours(mask, retrieval, cv2.CHAIN_APPROX_SIMPLE)
    if name != 'seasoning':
        main_index = max(range(len(contours)), key=lambda i: cv2.contourArea(contours[i]))
        outer = contours[main_index]
        holes = [c for i,c in enumerate(contours) if name == 'onion' and hierarchy[0,i,3] == main_index and cv2.contourArea(c) > 10000]
        contours = [outer] + holes
    else:
        contours = [c for c in contours if cv2.contourArea(c) > 3]
    points = np.concatenate(contours)
    x,y,w,h = cv2.boundingRect(points)
    paths = []
    for contour in contours:
        contour = cv2.approxPolyDP(contour, 0.65, True)
        pts = contour[:,0,:]
        paths.append('M' + 'L'.join(f'{px},{py}' for px,py in pts) + 'Z')
    metadata[name] = {'viewBox': f'{x} {y} {w} {h}', 'width': w, 'height': h, 'path': ''.join(paths)}
    print(name, (x,y,w,h), 'mask points:', sum(len(c) for c in contours))

(ROOT / 'lib').mkdir(exist_ok=True)
(ROOT / 'lib' / 'asset-masks.json').write_text(json.dumps(metadata), encoding='utf-8')

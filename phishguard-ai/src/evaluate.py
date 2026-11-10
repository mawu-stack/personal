"""Held-out evaluation with phishing as the positive class."""
import numpy as np
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, confusion_matrix, roc_curve

def evaluate(model, X, y):
    probability = model.predict_proba(X)[:, list(model.classes_).index(1)]
    pred = model.predict(X)
    fpr, tpr, _ = roc_curve(y, probability)
    result = {name: float(fn(y, pred)) for name, fn in [
        ('accuracy', accuracy_score), ('precision', precision_score),
        ('recall', recall_score), ('f1', f1_score)]}
    result.update(roc_auc=float(roc_auc_score(y, probability)),
                  confusion=confusion_matrix(y, pred, labels=[0, 1]).tolist(),
                  roc=[{'fpr': float(x), 'tpr': float(z)} for x, z in zip(fpr, tpr)])
    return result, pred, probability

def aggregate_importance(pipeline, features):
    weights = pipeline.named_steps['model'].feature_importances_
    categories = pipeline.named_steps['encode'].named_steps['onehot'].categories_
    result, offset = [], 0
    for feature, values in zip(features, categories):
        result.append({'feature': feature, 'importance': float(np.sum(weights[offset:offset + len(values)]))})
        offset += len(values)
    return sorted(result, key=lambda x: x['importance'], reverse=True)

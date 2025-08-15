PROJECT_NUMBER=$(gcloud projects describe afrikoin-deploy --format='value(projectNumber)')

# Pousser l'image
gcloud projects add-iam-policy-binding afrikoin-deploy \
  --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
  --role="roles/artifactregistry.writer"

# Déployer sur Cloud Run
gcloud projects add-iam-policy-binding afrikoin-deploy \
  --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
  --role="roles/run.admin"

# Utiliser le service account d'exécution (par défaut ou custom) lors du déploiement
gcloud projects add-iam-policy-binding afrikoin-deploy \
  --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"

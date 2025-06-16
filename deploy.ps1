Write-Host "`n✅ [1/3] React 프론트엔드 빌드 중..."
cd client
npm run build
cd ..

Write-Host "`n🚀 [2/3] 백엔드 Cloud Run 배포 중..."
cd server
gcloud run deploy clothes-server --source . --region=asia-northeast3
cd ..

Write-Host "`n🌐 [3/3] Firebase Hosting 배포 중..."
firebase deploy --only hosting

Write-Host "`n🎉 전체 배포 완료!"

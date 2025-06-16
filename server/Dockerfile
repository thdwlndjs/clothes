# Dockerfile

# 1. 베이스 이미지 선택 (Node.js 18 버전을 추천)
FROM node:18-slim

# 2. 앱 소스를 복사할 작업 디렉토리 설정
WORKDIR /usr/src/app

# 3. package.json, package-lock.json 복사
COPY package*.json ./

# 4. 의존성 설치
RUN npm install

# 5. 앱 소스 전체 복사
COPY . .

# 6. 앱이 사용할 포트 노출 (참고용이며, 실제로는 process.env.PORT를 따름)
EXPOSE 8080

# 7. 앱 실행 명령어: 'npm start' 대신 'node server.js'를 직접 실행하도록 명시
#    이렇게 하면 Node.js가 WORKDIR(/usr/src/app) 내에서 server.js를 찾으려 할 것입니다.
CMD [ "node", "server.js" ]
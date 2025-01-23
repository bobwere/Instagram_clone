pipeline {
  agent any

  environment {
    NEW_VERSION = '0.0.1'
    dockerHub = credentials('dockerRegistry')
  }

  stages {

    stage('Run tests') {
      }

      stage('build & push UAT image') {
          when {
              expression {
                BRANCH_NAME == 'develop'
              }
          }

          steps {
              echo "building UAT app v${NEW_VERSION}..."
              updateGitlabCommitStatus(name: 'build & push UAT image', state: 'pending')

           sh '''
               docker build -t touchinspiration/azanzi-web-api  \
                --build-arg BASE_PATH=${BASE_PATH} \
                --build-arg CLUSTERING=${CLUSTERING_UAT} \
                --build-arg LOG_LEVEL=${LOG_LEVEL_UAT} \
                --build-arg NODE_ENV=${NODE_ENV} \
                --build-arg PORT=${PORT} \
                --build-arg SWAGGER_DOC_PATH=${SWAGGER_DOC_PATH} \
                --build-arg DB_HOST=${DB_HOST_UAT} \
                --build-arg DB_PORT=${DB_PORT_UAT} \
                --build-arg DB_USER=${DB_USER_UAT} \
                --build-arg DB_NAME=${DB_NAME_UAT}  \
                --build-arg DB_PASSWORD=${DB_PASSWORD_UAT} \
                --build-arg JWT_SECRET=${JWT_SECRET} \
                --build-arg JWT_EXPIRES_IN=${JWT_EXPIRES_IN} \
                --build-arg JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET} \
                --build-arg JWT_REFRESH_EXPIRES_IN=${JWT_REFRESH_EXPIRES_IN} \
                --build-arg COOKIE_SECRET=${COOKIE_SECRET} \
                --build-arg MAILGUN_DOMAIN=${MAILGUN_DOMAIN} \
                --build-arg MAILGUN_API_KEY=${MAILGUN_API_KEY} \
                --build-arg PRIMARY_EMAIL=${PRIMARY_EMAIL} \
                --build-arg USE_MAILGUN_TEMPLATE=${USE_MAILGUN_TEMPLATE} \
                --build-arg MAILGUN_DEFAULT_TEMPLATE_NAME=${MAILGUN_DEFAULT_TEMPLATE_NAME} \
                --build-arg REDIS_HOST=${REDIS_HOST} \
                --build-arg REDIS_PORT=${REDIS_PORT} \
                --build-arg REDIS_PASSWORD=${REDIS_PASSWORD} \
                --build-arg FRONTEND_URL=${FRONTEND_URL_UAT} \
                --build-arg BACKEND_URL=${BACKEND_URL_UAT} \
               -f ${WORKSPACE}/deployment/ci/production/Dockerfile .

               docker run touchinspiration/azanzi-web-api sh

               docker commit $(docker ps -lq) azanziwebapiuat

               echo $dockerHub_PSW | docker login -u $dockerHub_USR https://registry.touchinspiration.net/v2 --password-stdin

               docker tag azanziwebapiuat registry.touchinspiration.net/azanzi-web-api:uat

               docker push registry.touchinspiration.net/azanzi-web-api:uat

               '''
          }

          post {
              success { updateGitlabCommitStatus(name: 'build & push UAT image', state: 'success') }
              failure { updateGitlabCommitStatus(name: 'build & push UAT image', state: 'failed') }
          }
      }


      stage('build & push PROD image') {
          when {
              expression {
                BRANCH_NAME == 'master'
              }
          }

          steps {
              echo "building the application v${NEW_VERSION}..."
              updateGitlabCommitStatus(name: 'build & push prod image', state: 'pending')


           sh '''
               docker build -t touchinspiration/azanzi-web-api  \
                --build-arg BASE_PATH=${BASE_PATH} \
                --build-arg CLUSTERING=${CLUSTERING_UAT} \
                --build-arg LOG_LEVEL=${LOG_LEVEL_UAT} \
                --build-arg NODE_ENV=${NODE_ENV} \
                --build-arg PORT=${PORT} \
                --build-arg SWAGGER_DOC_PATH=${SWAGGER_DOC_PATH} \
                --build-arg DB_HOST=${DB_HOST_UAT} \
                --build-arg DB_PORT=${DB_PORT_UAT} \
                --build-arg DB_USER=${DB_USER_UAT} \
                --build-arg DB_NAME=${DB_NAME_UAT}  \
                --build-arg DB_PASSWORD=${DB_PASSWORD_UAT} \
                --build-arg JWT_SECRET=${JWT_SECRET} \
                --build-arg JWT_EXPIRES_IN=${JWT_EXPIRES_IN} \
                --build-arg JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET} \
                --build-arg JWT_REFRESH_EXPIRES_IN=${JWT_REFRESH_EXPIRES_IN} \
                --build-arg COOKIE_SECRET=${COOKIE_SECRET} \
                --build-arg MAILGUN_DOMAIN=${MAILGUN_DOMAIN} \
                --build-arg MAILGUN_API_KEY=${MAILGUN_API_KEY} \
                --build-arg PRIMARY_EMAIL=${PRIMARY_EMAIL} \
                --build-arg USE_MAILGUN_TEMPLATE=${USE_MAILGUN_TEMPLATE} \
                --build-arg MAILGUN_DEFAULT_TEMPLATE_NAME=${MAILGUN_DEFAULT_TEMPLATE_NAME} \
                --build-arg REDIS_HOST=${REDIS_HOST} \
                --build-arg REDIS_PORT=${REDIS_PORT} \
                --build-arg REDIS_PASSWORD=${REDIS_PASSWORD} \
                --build-arg FRONTEND_URL=${FRONTEND_URL_UAT} \
                --build-arg BACKEND_URL=${BACKEND_URL_UAT} \
               -f ${WORKSPACE}/deployment/ci/production/Dockerfile .

               docker run touchinspiration/azanzi-web-api sh

               docker commit $(docker ps -lq) azanziwebapiprod

               echo $dockerHub_PSW | docker login -u $dockerHub_USR https://registry.touchinspiration.net/v2 --password-stdin

               docker tag azanziwebapiprod registry.touchinspiration.net/azanzi-web-api:prod

               docker push registry.touchinspiration.net/azanzi-web-api:prod

              '''
          }

           post {
              success { updateGitlabCommitStatus(name: 'build & push prod image', state: 'success') }
              failure { updateGitlabCommitStatus(name: 'build & push prod image', state: 'failed') }
          }
      }

      stage('deploying to UAT') {
          when {
              expression {
                BRANCH_NAME == 'develop'
              }
          }

          steps {
              echo "deploying the UAT app v${NEW_VERSION}..."
              updateGitlabCommitStatus(name: 'deploying to UAT', state: 'pending')

              sshagent(['azanzi-droplet-ssh']){
                 sh '''
                    scp -r -o StrictHostKeyChecking=no ./deployment/ci/uat/docker-compose.yml root@165.227.144.19:/opt/nginx-ssl
                    scp -r -o StrictHostKeyChecking=no ./deployment/nginx/uat/default.conf root@165.227.144.19:/opt/nginx-ssl/deployment/nginx/uat


                    [ -d ~/.ssh ] || mkdir ~/.ssh && chmod 0700 ~/.ssh
                    ssh-keyscan -t rsa,dsa 165.227.144.19>> ~/.ssh/known_hosts
                    ssh root@165.227.144.19 << 'ENDSSH'

                    echo $dockerHub_PSW | docker login -u $dockerHub_USR https://registry.touchinspiration.net/v2 --password-stdin

                    docker compose -f /opt/nginx-ssl/docker-compose.yml down --rmi all
                    docker compose -f /opt/nginx-ssl/docker-compose.yml up -d --build

                    docker system prune -af

                    '''
              }
          }

           post {
              success { updateGitlabCommitStatus(name: 'deploying to UAT', state: 'success') }
              failure { updateGitlabCommitStatus(name: 'deploying to UAT', state: 'failed') }
          }
      }


      stage('deploying to Prod') {
          when{
              expression {
                BRANCH_NAME == 'master'
              }
          }

          steps {
              echo "deploying the PROD app v${NEW_VERSION}..."
              updateGitlabCommitStatus(name: 'deploying to Prod', state: 'pending')

              sshagent(['azanzi-droplet-ssh']){
                 sh '''

                    scp -r -o StrictHostKeyChecking=no ./deployment/ci/production/docker-compose.yml root@161.35.44.95:/opt/nginx-ssl
                    scp -r -o StrictHostKeyChecking=no ./deployment/nginx/production/default.conf root@161.35.44.95:/opt/nginx-ssl/deployment/nginx/production

                    [ -d ~/.ssh ] || mkdir ~/.ssh && chmod 0700 ~/.ssh
                    ssh-keyscan -t rsa,dsa 161.35.44.95>> ~/.ssh/known_hosts
                    ssh root@161.35.44.95 << 'ENDSSH'

                    echo $dockerHub_PSW | docker login -u $dockerHub_USR https://registry.touchinspiration.net/v2 --password-stdin

                    docker compose -f /opt/nginx-ssl/docker-compose.yml down --rmi all
                    docker compose -f /opt/nginx-ssl/docker-compose.yml up -d --build

                    docker system prune -af
                    '''
              }
          }

            post {
              success { updateGitlabCommitStatus(name: 'deploying to Prod', state: 'success') }
              failure { updateGitlabCommitStatus(name: 'deploying to Prod', state: 'failed') }
          }
      }
  }
}

#############################################################
# Dockerfile para configurar aplicación factuweb
############################################################

FROM node:10-alpine

RUN mkdir -p /app/factuweb-backend
USER root

RUN npm install sails -g

WORKDIR /app/factuweb-backend
# COPY . .

EXPOSE 1337

# RUN npm install nodemon -g --quiet
# CMD nodemon -w api -w config

CMD sails lift

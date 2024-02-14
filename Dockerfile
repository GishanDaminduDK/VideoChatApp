

# COPY package.json /app/  
# COPY frontend/* /app/frontend/
# COPY server.js /app/
# WORKDIR /app            
# RUN npm install
# RUN npm run build     
# CMD [ "npm", "start" ]
FROM node:19-alpine   
COPY frontend/package.json /app/frontend/  
COPY frontend/public/* /app/frontend/public/
COPY frontend/src/* /app/frontend/src/
WORKDIR /app/frontend 
RUN npm install
RUN npm run build 
COPY package.json /app/
COPY server.js /app/
WORKDIR /app            
RUN npm install    

CMD [ "npm", "start" ] 




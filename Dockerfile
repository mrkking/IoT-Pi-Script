FROM node:11
RUN mkdir -p /code
WORKDIR /code
ADD . /code
RUN npm install -s
CMD ["npm", "start"]

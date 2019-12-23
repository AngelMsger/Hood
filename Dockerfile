FROM node:13-alpine

LABEL maintainer=i@angelmsger.com

WORKDIR /var/app

ENV NODE_ENV=production
ENV TZ=UTC

ADD dist /var/app/dist/
ADD resource /var/app/resource/
ADD package.json /var/app/

RUN ["npm", "i", "--registry https://mirrors.huaweicloud.com/repository/npm/"]

EXPOSE 3000

HEALTHCHECK --interval=5m --timeout=3s \
        CMD ["node", "dist/tool/HealthCheck.js"]

CMD ["node", "dist/App.js"]

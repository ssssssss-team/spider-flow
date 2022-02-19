#FROM maven:3.6.1-jdk-8-alpine AS build
# https://github.com/nekolr/maven-image/tree/master/3.6.1-jdk-8
FROM maven:3.6-jdk-11 as builder


WORKDIR /app

COPY . .

RUN mvn clean package


FROM openjdk:8-jdk-alpine

COPY --from=build /app/spider-flow-web/target/spider-flow.jar .

EXPOSE 8088

CMD java -jar spider-flow.jar

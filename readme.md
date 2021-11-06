# Crawler Legendas
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=diegopavani1_CrawlerLegends&metric=bugs)](https://sonarcloud.io/summary/new_code?id=diegopavani1_CrawlerLegends) [![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=diegopavani1_CrawlerLegends&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=diegopavani1_CrawlerLegends)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=diegopavani1_CrawlerLegends&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=diegopavani1_CrawlerLegends)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=diegopavani1_CrawlerLegends&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=diegopavani1_CrawlerLegends)

O projeto se trata de um scrapper que raspa o site <http://legendas.tv/> salvando as informações no banco de dados não relacional MongoDB.
O projeto consiste em 2 workers, um producer e um consumer, a comunicação entre eles é realizado pelo kafka.

#### O producer é o 'worker' que raspa o site e extrai as informações necessárias, enviando em forma de mensagem para um topico do kafka.
#### O consumer é o 'worker' que ficará escutando no topico do kafka e irá realizar a persistencia das informações no banco de dados.

## Requisitos
É necessário ter o docker na maquina em que irá subir o ambiente

## Como subir o ambiente
Após clonar o repositório e entrar na pasta, você precisará rodar o comando abaixo no terminal

``docker-compose up --build``

## Acessando o banco de dados
Você pode acessando os dados através do MongoDb Compass, se você não tiver instalado você pode baixar pelo
link: https://www.mongodb.com/try/download/compass

Após instalado insira a seguinte string de conexão e clique em 'connect'

``mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false``
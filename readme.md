# Crawler Legendas
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=diegopavani1_CrawlerLegends&metric=bugs)](https://sonarcloud.io/summary/new_code?id=diegopavani1_CrawlerLegends) [![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=diegopavani1_CrawlerLegends&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=diegopavani1_CrawlerLegends)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=diegopavani1_CrawlerLegends&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=diegopavani1_CrawlerLegends)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=diegopavani1_CrawlerLegends&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=diegopavani1_CrawlerLegends)

O projeto se trata de um scrapper que raspa o site <http://legendas.tv/> salvando as informações no banco de dados não relacional MongoDB.
O projeto consiste em 2 workers, um producer e um consumer, a comunicação entre eles é realizado pelo kafka.

#### O producer é o 'worker' raspar o site e extrair as informações necessárias, enviando em forma de mensagem para um topico do kafka.
#### O consumer é o 'worker' que ficará escutando no topico do kafka e irá realizar a persistencia das informações no banco de dados.

## Requisitos
É necessário ter o docker na maquina em que irá subir o ambiente

## Como subir o ambiente
Após clonar o repositório e entrar na pasta, você precisará rodar o comando abaixo no terminal
``docker-compose up -d``
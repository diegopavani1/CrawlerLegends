# Crawler Legendas
O projeto se trata de um scrapper que raspa o site <http://legendas.tv/> salvando as informações no banco de dados não relacional MongoDB.
O projeto consiste em 2 workers, um producer e um consumer, a comunicação entre eles é realizado pelo kafka.

### O producer é o 'worker' raspar o site e extrair as informações necessárias, enviando em forma de mensagem para um topico do kafka.
### O consumer é o 'worker' que ficará escutando no topico do kafka e irá realizar a persistencia das informações no banco de dados.

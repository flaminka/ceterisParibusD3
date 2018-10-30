# install.packages("htmlwidgets")
# install.packages("devtools")


# to do tworzenia struktury folderu, nie wywolywac potem, tylko  w tym folderze podmieniac pliki na aktualne 
#devtools::create("ceterisParibusD3")       

setwd("ceterisParibusD3")

# teraz edytuj plik ceterisParibusD3.R i ceterisParibusD3.js z tgo folderu na aktualne i potem wywo³aj to co jest pod spodem
# ew. edyktuj ceterisParibusD3.yaml lub initialExample.R

# po wklejeniu kodu JS do ceterisParibusD3.js do pierwszej sekcji popraw bledy ktore wyskakuja

# to tez tylko raz przy piewrszym uzyciu, to tworzy strukture folderu
#htmlwidgets::scaffoldWidget("ceterisParibusD3")    # create widget scaffolding
devtools::install()                        # install the package so we can try it


#przyklad do sprawdzenia dzialania ew. w reszta w pliku initialExample.R do sprawdzenia dzialania
library(ceterisParibusD3)

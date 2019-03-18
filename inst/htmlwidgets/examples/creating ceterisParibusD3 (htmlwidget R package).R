# install.packages("htmlwidgets")
# install.packages("devtools")

library(htmlwidgets)
library(devtools)

# to do tworzenia struktury folderu, nie wywolywac potem, tylko  w tym folderze podmieniac pliki na aktualne
#devtools::create("ceterisParibusD3")


setwd("C:/Users/Ewa/Desktop/INTERACTIVE XAI FOR DALEX/6. (January)/ceterisParibusD3/")
getwd()
#setwd("ceterisParibusD3")

# teraz edytuj plik ceterisParibusD3.R i ceterisParibusD3.js z tgo folderu na aktualne i potem wywo?aj to co jest pod spodem
# ew. edyktuj ceterisParibusD3.yaml lub initialExample.R

# po wklejeniu kodu JS do ceterisParibusD3.js do pierwszej sekcji popraw bledy ktore wyskakuja

# to tez tylko raz przy piewrszym uzyciu, to tworzy strukture folderu
#htmlwidgets::scaffoldWidget("ceterisParibusD3")    # create widget scaffolding
#devtools::install()                        # install the package so we can try it


devtools::load_all()
devtools::use_testthat()
devtools::test()
devtools::document()
devtools::build()
devtools::install()

# sprawdzam czy help dziala
library(ceterisParibusD3)
?ceterisParibusD3::ceterisParibusD3

# generuje plik pdf z dokuemtnacja
system("R CMD Rd2pdf .")
system("R CMD Rd2pdf . --title=Package ceterisParibusD3 --output=./manual.pdf --force")
# potem zmien nazwe pliku .pdf na ceterisParibusD3.pdf

#### wszytko ladnie poszlo ale nie dziala ?funkcja nagle w calym r studio
#utils::help("plot_interactive_d3", 'ceterisParibus')

#install_github(repo = 'flaminka/ceterisParibus' )


#install_version("pkgload", version = "1.0.1", repos = "http://cran.us.r-project.org")




#przyklad do sprawdzenia dzialania ew. w reszta w pliku initialExample.R do sprawdzenia dzialania
library(ceterisParibusD3)

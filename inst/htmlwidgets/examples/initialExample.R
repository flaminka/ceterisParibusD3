library("DALEX")
library("randomForest")
library("ceterisParibus")
library("rpart")
library("e1071")
library(ceterisParibusD3)


####################################
# example 1 - ICE lines with points
####################################


apartments_rf_model <- randomForest(m2.price ~ construction.year + surface + floor +
                                      no.rooms + district,
                                    data = apartments)

explainer_rf <- explain(apartments_rf_model,
                        data = apartmentsTest[,2:6],
                        y = apartmentsTest$m2.price)

apartments_A <- apartmentsTest[c(958,955),]

cp_rf_A <- ceteris_paribus(explainer_rf, apartments_A, y = apartments_A$m2.price)

plot(cp_rf_A, show_profiles = TRUE, show_observations = TRUE,
     selected_variables = c("surface","construction.year", 'no.rooms'))

ceterisParibusD3(cp_rf_A, show_profiles = TRUE, show_observations = TRUE,
                 color = 'surface',
                 selected_variables = c("surface","construction.year", 'no.rooms', 'district'), add_table = TRUE,
                 height  = 800, width = 800, is_categorical_ordered = TRUE)


####################################
# example 2 ICE lines colored by categorical variable
####################################
apartments_C <- select_sample(apartmentsTest, n = 5)
cp_rf_C <- ceteris_paribus(explainer_rf, apartments_C, y = apartments_C$m2.price)

plot(cp_rf_C,
     show_profiles = TRUE, show_observations = FALSE,
     color = "district", alpha = 1,
     selected_variables = c("surface","construction.year", "district", 'no.rooms', 'floor'))

# no need to include color variable in selected_variables
ceterisParibusD3(cp_rf_C, show_profiles = TRUE, show_observations = FALSE,
                 color = 'district', alpha_ices = 1,
                 selected_variables = c("surface","construction.year", 'no.rooms', 'floor'), height = 600,
                 width = 800)

####################################
# example 3 ICE lines colored by contiuous variable
####################################
apartments_C <- select_sample(apartmentsTest, n = 15)
cp_rf_C <- ceteris_paribus(explainer_rf, apartments_C, y = apartments_C$m2.price)

plot(cp_rf_C,
     show_profiles = TRUE, show_observations = TRUE,
     color = "surface", alpha = 1,
     selected_variables = c("surface","construction.year"))

ceterisParibusD3(cp_rf_C, show_profiles = TRUE, show_observations = TRUE,
                 color = 'surface', alpha_ices = 1,
                 selected_variables = c("surface","construction.year"))

####################################
# example 4 ICE lines, rugs, residuals, points, all with custom colors
####################################
apartments_C <- select_sample(apartmentsTest, n = 15)
cp_rf_C <- ceteris_paribus(explainer_rf, apartments_C, y = apartments_C$m2.price)

plot(cp_rf_C,
     show_profiles = TRUE, show_observations = TRUE, show_rugs = TRUE,
     show_residuals = TRUE,
     color = "blue", color_points = "orange", color_residuals = "red", color_rugs = "green",
     alpha = 0.3, alpha_points = 0.3, alpha_residuals = 0.5, alpha_rugs = 1,
     size_points = 4, size_rugs = 0.5,
     selected_variables = c("surface","construction.year"))

ceterisParibusD3(cp_rf_C,
     show_profiles = TRUE, show_observations = TRUE, show_rugs = TRUE,
     show_residuals = TRUE,
     color = "blue", color_points = "orange", color_residuals = "red", color_rugs = "green",
     alpha_ices = 0.3, alpha_points = 0.3, alpha_residuals = 0.5, alpha_rugs = 1,
     size_points = 4,  size_rugs = 0.5,
     selected_variables = c("surface","construction.year"))

####################################
# example 5 ICE lines with PDP lines
####################################
apartments_C <- select_sample(apartmentsTest, n = 10)
cp_rf_C <- ceteris_paribus(explainer_rf, apartments_C, y = apartments_C$m2.price)

plot(cp_rf_C,
     show_observations = FALSE, show_rugs = TRUE,
     show_residuals = TRUE, color_residuals = "red", size_residuals = 2,
     selected_variables = c("surface","construction.year")) +
  ceteris_paribus_layer(cp_rf_C,
                        show_observations = FALSE, show_rugs = FALSE,
                        aggregate_profiles = mean, size = 2, alpha = 1,
                        selected_variables = c("surface","construction.year"))

ceterisParibusD3(cp_rf_C,
     show_observations = FALSE, show_rugs = TRUE,
     show_residuals = TRUE, color_residuals = "red", size_residuals = 2,
     selected_variables = c("surface","construction.year"),
     aggregate_profiles = 'mean', size_pdps = 5, alpha_pdps = 1, width = 800, height = 600,
     size_rugs = 0.5)

####################################
# example 6 many models
####################################

apartments_svm_model <- svm(m2.price ~ construction.year + surface + floor +
                              no.rooms + district, data = apartments)

apartments_rpart_model <- best.rpart(m2.price ~ construction.year + surface + floor + no.rooms + district, data = apartments)

explainer_svm <- explain(apartments_svm_model,
                         data = apartmentsTest[,2:6], y = apartmentsTest$m2.price)

explainer_rpart <- explain(apartments_rpart_model,
                           data = apartmentsTest[,2:6], y = apartmentsTest$m2.price)

apartments_E <- apartmentsTest[958,]
cp_rf_E <- ceteris_paribus(explainer_svm, apartments_E, y = apartments_E$m2.price)

apartments_F <- apartmentsTest[958,]
cp_rpart_F <- ceteris_paribus(explainer_rpart, apartments_F, y = apartments_F$m2.price)


plot(cp_rf_A, cp_rf_E, cp_rpart_F,
     color = "_label_",
     selected_variables = c("surface","construction.year"))

ceterisParibusD3(cp_rf_A, cp_rf_E, cp_rpart_F,
     color = "_label_",
     selected_variables = c("surface","construction.year"), width = 800)


####################################
# example 7 categorical with numerical variables
####################################

plot(cp_rf_A, show_profiles = TRUE, show_observations = TRUE,
     selected_variables = c("surface","district"))

ceterisParibusD3(cp_rf_A, show_profiles = TRUE, show_observations = TRUE,
     selected_variables = c("surface","district"))





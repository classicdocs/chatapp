#### Stage 1: Build the react application
FROM node:12.4.0-alpine as build

# Configure the main working directory inside the docker image. 
# This is the base directory used in any further RUN, COPY, and ENTRYPOINT 
# commands.
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
#ENV PATH /app/node_modules/.bin:$PATH

# Copy the package.json as well as the package-lock.json and install 
# the dependencies. This is a separate step so the dependencies 
# will be cached unless changes to one of those two files 
# are made.
COPY package.json package-lock.json ./
RUN npm install

# Copy the main application
COPY . ./

# Build the application
RUN npm run build

# Expose port 80 to the Docker host, so we can access it 
# from the outside.
EXPOSE 80


# za apache, samo treba lepo namestiti .htaccess da bi radio refresh
# FROM httpd:2.4
# COPY --from=build /app/build /usr/local/apache2/htdocs/
# COPY --from=build /app/build/.htaccess /usr/local/apache2/conf/httpd.conf
# CMD ["apachectl", "-D", "FOREGROUND"]


FROM nginx:1.16.0-alpine
COPY .config/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]

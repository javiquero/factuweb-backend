
<p align="center">
  <img width="300" src="https://raw.githubusercontent.com/javiquero/factuweb/master/images/header.png">
</p>


# [Factuweb](https://github.com/javiquero/factuweb "Factuweb")
### _https://github.com/javiquero/factuweb_

Con este proyecto tendremos una web completa a partir de la información de nuestro [Factusol](https://www.sdelsol.com/programa-facturacion-factusol/ "Factusol"). Los clientes pueden consultar nuestro catálogo, hacer pedidos, consultar todo su historico de pedidos, facturas y contactar con nosotros a través de un formulario.

## Proyecto
FactuWeb consta de 3 partes. El frontend programado en Svelte, un backend, en este caso he seleccionado Salils/js por su simplicidad a la hora de generar una api y por el uso del ORM Waterline que nos va a permitir usar la base de datos que queramos (mysql, mongodb, postgresql) y una aplicación programada en c# que será la encargada de mantener nuestra api actualizada con la información de nuestra instalación de factusol.
<br>


#### Backend
Para el backend he seleccionado Salils/js por su simplicidad a la hora de generar una api y por el uso del ORM Waterline que nos va a permitir usar la base de datos que queramos (mysql, mongodb, postgresql).

<p align="center">
  <img width="200" src="https://camo.githubusercontent.com/9e49073459ed4e0e2687b80eaf515d87b0da4a6b/687474703a2f2f62616c64657264617368792e6769746875622e696f2f7361696c732f696d616765732f6c6f676f2e706e67">
</p>

Mas información sobre sails: https://github.com/balderdashy/sails/


### Instalación y puesta en marcha
Puedes lanzar todo el proyecto de forma automática a través del repositorio [Factuweb](https://github.com/javiquero/factuweb "Factuweb")
```
git clone https://github.com/javiquero/factuweb.git
cd factuweb
docker-composer up
```

o puedes ejecutar el backend y el frontend por separado.
```
git clone https://github.com/javiquero/factuweb-backend.git
cd factuweb-backend
npm install
sails lift &
cd ..
git clone https://github.com/javiquero/factuweb-frontend.git
cd factuweb-frontend
npm install
npm run dev
```

---

## Factusol
FACTUSOL es un programa de facturación gratuito que sirve tanto para gestionar la facturación de tu empresa y llevar el control de stock como para gestionar una facturación de servicios. Se adapta fácilmente a las necesidades de los usuarios y ofrece la información de modo visual y atractivo.

Es un software de facturación muy completo que puede cubrir cualquier necesidad como autónomo o que tenga tu pyme, no vas a echar en falta ninguna función. Sirve para todo tipo de actividades que requieran gestionar compras, ventas, stock, cobros, pagos, servicios, suplidos etc.

Puedes descargarlo gratuitamente desde [aquí](https://www.sdelsol.com/programa-facturacion-factusol/ "aquí").


## License

[MIT License](https://opensource.org/licenses/MIT)  Copyright © 2020-present, Javier Quero


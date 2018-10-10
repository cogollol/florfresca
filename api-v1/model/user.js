var mongoose 	= require( 'mongoose' ),
  crypto     	= require('crypto');

var Tarjeta = new mongoose.Schema({
  toke:String,
  name:String,
  document:String,
  number:String,
  expMonth:String,
  expYear:String,
  type:String,
  address: {
               line1: String,
               line2: String,
               line3: String,
               postalCode: String,
               city: String,
               state: String,
               country:{type:String, default:"CO"},
               phone: String
            }
})

var Usuario 	= new mongoose.Schema({
  nombre: String,
  apellido: String,
  correo: {
    type: String,
    unique: true,
    required: true
  },
  telefono: String,
  celular: Number,
  tipo_doc: String,
  documento:  String,
  dir:String,
  hash: String,
  salt: String,
  reset: String,
  expires: String,
  activo: {type:Boolean, default:false},
  creado:  { type:Date, default: Date.now },
  tarjeta:[Tarjeta],
  payuId: String,
});

Usuario.methods.setPass = function(password){
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64,"sha512").toString('hex');
};

Usuario.methods.validPass = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64,"sha512").toString('hex');
  return this.hash === hash;
};

mongoose.model('users', Usuario);
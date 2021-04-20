const Service = require('../models/Service.models.js');
const User = require('../models/User.models.js');
const api = require('../services/api.js');

class ServiceController {

    async myServices(req, res){
        const user_id = req.userId;
        try{
            const services = await Service.find({user:user_id})
            return res.send(services)
        }catch(err){
            return res.status(400).send({error:"request failed "+err});
        }
        
    }

    async store(req, res){
        const user_id = req.userId;
        const {title, description, price, duration, image} = req.body;
        const user = await User.findOne({ _id:user_id })
        if(!user_id){
            return res.status(400).send({ error: 'acesso negado, necessita de um User_id' });
        }
        if(!user){
            return res.status(400).send({ error: 'user do not exists' });
        }
        
        try{

            const service = await Service.create(
                {
                    user:user_id,
                    title,
                    description,
                    price,
                    duration,
                    image,
                }
            );
            return res.send({service, user})
        } catch (err){
            return res.status(400).send({error:"registration failed"+err});
        }


    }

    async update(req, res){
        const {service_id} = req.params;
        const user_id = req.userId;
        const {title, description, price, duration, image} = req.body;
        if(!user_id){
            return res.status(400).send({ error: 'User_id não fornecido' });
        }
        const user = await User.findById(user_id);
        const service = await Service.findById(service_id);
        try{
            if(!user){
                return res.status(400).send({ error: 'user não encontrado' });
            }
            
            if(String(user._id)!== String(service.user)){
                return res.status(400).send({ error: 'Não autorizado' });
            }
    
            await Service.updateOne({_id: service_id},
                {
                    user:user_id,
                    title,
                    description,
                    price,
                    duration,
                    image,
                }
            );
            return res.send({message:"serviço alterado!"})
        }catch(err){
            return res.status(400).send({error:"registration failed: "+err});

        }

    }

    async listAll(req, res){
        try{
            const service = await Service.find()
            return res.send(service)
        }catch(err){
            return res.status(400).send({error:"registration failed: "+err});
        }
    }

    async listCompany(req, res){
        const {company_link} = req.params
        const user = await User.findOne({company_link});
        try{
            if(!user){
                return res.status(404).send({ error: 'user not found' });
            }
            const services = await Service.find({user:user._id})
            return res.send(services)
        }catch (err){
            return res.status(400).send({error:"registration failed: "+err});
        }
    }

    async listOne(req, res){
        const {company_link} = req.params;
        const {service_id} = req.params;
        try{
            const user = await User.findOne({company_link});
            const service = await Service.findOne({_id:service_id});
            
            if(!service || !user || String(user._id) !== String(service.user) ){
                return res.status(404).send({ error: 'Service not found' });
            }

            return res.send({service, user})
        }catch(err){
            return res.status(400).send({error:"registration failed: "+err});
        }
    }
    async listOneId(req, res){
        const {service_id} = req.params;
        try{
            const service = await Service.findOne({_id:service_id});
            if(!service){
                return res.status(404).send({ error: 'Service not found' });
            }

            return res.send({service})
        }catch(err){
            return res.status(400).send({error:"registration failed: "+err});
        }
    }

    async delete(req, res){
        const {service_id} = req.params;
        const user_id = req.userId;
        if(!user_id){
            return res.status(400).send({ error: 'User_id não fornecido' });
        }
        const user = await User.findById(user_id);
        const service = await Service.findById(service_id);
        try{
            if(!user){
                return res.status(400).send({ error: 'user não encontrado' });
            }
            
            if(String(user._id)!== String(service.user)){
                return res.status(400).send({ error: 'Não autorizado' });
            }
    
            await Service.deleteOne({_id: service_id});
            return res.send({message:"serviço deletado"})
        }catch(err){
            return res.status(400).send({error:"delete failed: "+err});

        }

    }
    

}

module.exports = new ServiceController;
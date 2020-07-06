import React, {useEffect, useState} from 'react'
import './styles.css'
import api from '../../services/api'
import { FaSearch, FaPlus, FaTimes } from 'react-icons/fa'

export default function Home(){
    const [tools, setTools] = useState([])
    const [id, setId] = useState('')
    const [hiddenViewDelete, setHiddenViewDelete] = useState('hidden')
    const [hiddenViewAdd, setHiddenViewAdd] = useState('hidden')
    const [viewBlock, setViewBlock] = useState('none')
    const [check, setCheck] = useState(false)
    const [title, setTitle] = useState('')
    const [link, setLink] = useState('')
    const [description, setdescription] = useState('')
    const [tagss, setTagss] = useState('')
    
{/*Função responsavel por carregar as tools via query parms, 
    existe um state chamado check que serve para trocar o tipo de query,
    na hora da requisição
*/}
   const handleLoadToolsQuery=(value)=>{  
    var array = []
       if(check === true){      
            api.get(`/tools?tags_like=${value}`)
            .then(response =>{           
                for(let i=0;i<response.data.length;i++){
                array[i] = response.data[i];
                array[i].tags= array[i].tags.join(' #')           
                }
            setTools(array)           
            })
        }else{
            api.get(`/tools?q=${value}`)
            .then(response =>{            
                for(let i=0;i<response.data.length;i++){
                array[i] = response.data[i];
                array[i].tags= array[i].tags.join(' #')           
                }
            setTools(array)           
            })
        }
   }

{/*Função responsavel por carregar as tools somente*/}
   const handleLoadToolsStandard=()=>{      
    var array = []
     api.get('/tools')
     .then(response =>{        
         for(let i=0;i<response.data.length;i++){
            array[i] = response.data[i];
            array[i].tags= array[i].tags.join(' #')           
         }
        setTools(array)           
     })
}

{/*Função responsavel por deletar as tools pelo id selecionado*/}
   async function handleDeleteToll(id){
       try{
            const response = await api.delete(`/tools/${id}`);
            toogleViewDelete()
            handleLoadToolsStandard();
       }catch(error){
            alert(error.response.data)
       }
   }

{/*Função responsavel por registrar uma nova ferramenta*/}
   async function handleRegisterNewTool(e){
    e.preventDefault();

    const tags = tagss.split(' ')
    // cria um array de strings

       const data={
        title,
        link,
        description,
        tags
       }

       try{
            const response = await api.post('/tools', data)
                resetForm()
                toogleViewAdd()
                handleLoadToolsStandard()
            
       }catch(error){
            alert(error.response.data)
       }
   }

{/*Função responsavel por criar o catalogo dinâmico de ferramentas */}
   const listTools=()=>{
     return tools.map((item, index )=>(
       <div key={index} className='box-list'>
           <div className='title'>               
                <h1><a href={item.link} target="blank"><u>{item.title}</u></a></h1>

                <label htmlFor='btn-del' className='btn-delete' >            
                    <FaTimes size={16} color='#fff'/>
                    <button id='btn-del' onClick={()=>setSelectForDelete(item.id)}>Delete</button>
                </label>

           </div>
            <p className='description'>{item.description}</p>
          
            <p className='list-tools'>{`#${item.tags}`}</p>
       </div>
   ))
   }   

{/*Função responsavel por setar o id da ferramenta que sera deletada 
 e chamar a view de deleção */}  
   const setSelectForDelete=(id)=>{
        toogleViewDelete()    
        setId(id)    
   }

{/*Função responsavel por mostrar a view de deleção e bloquear e desbloquear a tela 
  da aplicação para demais fucionalidades*/}
   const toogleViewDelete=()=>{
      hiddenViewDelete === 'hidden' ? setHiddenViewDelete('visible') : setHiddenViewDelete('hidden')
      viewBlock === 'none' ? setViewBlock('block') : setViewBlock('none')
   }

{/*Função responsavel por mostrar a view que possibilita o registro de uma nova ferramenta e bloquear e desbloquear a tela 
  da aplicação para demais fucionalidades*/}
   const toogleViewAdd=()=>{
      hiddenViewAdd === 'hidden' ? setHiddenViewAdd('visible') : setHiddenViewAdd('hidden')
      viewBlock === 'none' ? setViewBlock('block') : setViewBlock('none')
      resetForm()
   }

{/*Função responsavel por resetar os campos do formulario apos o registro ou ao cancelar o mesmo */}
   const resetForm=()=>{
       setTitle('')
       setLink('')
       setdescription('')
       setTagss([])
   }

   useEffect(()=>{
        handleLoadToolsStandard()
       
   },[])

    return(
        <div className='home '>          
               <header className='home-header'>
                    <h1>VUTTR</h1>
                    <p>Very Useful Tools to Remember</p>
               </header>

               <main className='home-main'>
                   <section className='home-main-section-01'>
                        <div className='box-section'>

                            <div className='search '>
                                <FaSearch size={16} color='#333333' />
                                 <input type='text' 
                                        placeholder='search'
                                        onChange={e => handleLoadToolsQuery(e.target.value)}/>
                            </div>

                            <div className='search-checkbox'>
                            <label className="label">
                                <input type="checkbox" 
                                        name="enviar-copia" 
                                        onClick={ ()=>check === false ? setCheck(true) : setCheck(false)}
                                        />
                                search tags only
                            </label>
                            </div>
                            
                        </div>

                        <label htmlFor='btn-add' className='box-section'>
                            <div className='add' onClick={toogleViewAdd}>
                                <FaPlus size={18} color='#fff'/>
                                <button id='btn-add'>Add</button>                              
                            </div>
                                                                           
                        </label>
                   </section>

                   <section className='home-main-section-02'>
                       {listTools()}
                   </section>
               </main>
           

            <div className={`box-delete ${hiddenViewDelete}`}>
                <div className='delete-title'>
                    <FaTimes size={18} color='#333333'/>
                    <p>Remove Tools</p>
                </div>

                <p className='delete-description'>Are you sure you want to remove tool?</p>

                <div className='btns'>
                    <button className='btn-cancel ' onClick={toogleViewDelete}>Cancel</button>
                    <button className='btn-confirm ' onClick={()=>handleDeleteToll(id)}>Yes remove</button>
                </div>
            </div>   

            <form className={`form-add-tool ${hiddenViewAdd}`} onSubmit={handleRegisterNewTool}>
                <label htmlFor='form-title'>Tool Name</label>
                <input type='text' 
                       id='form-title' 
                       value={title}
                       onChange={e => setTitle(e.target.value)}
                       required />

                <label htmlFor='form-link'>Tools Link</label>
                <input type='text'
                        id='form-link' 
                        value={link}
                        onChange={e => setLink(e.target.value)}
                        required />

                <label htmlFor='form-description'>Description</label>
                <textarea id='form-description'
                          cols="40" 
                          rows="15" 
                          value={description}
                          onChange={e => setdescription(e.target.value)}
                          required />

                <label htmlFor='form-tags'>Tags</label>
                <input type='text' 
                        id='form-tags'
                        value={tagss}
                        onChange={e => setTagss(e.target.value)}
                        required />

                <div className='btns'>
                    <input type='button' className='btn-cancel' onClick={toogleViewAdd} value='Cancel'></input>
                    <input type='submit' className='btn-confirm' value='Yes Add'></input>
                </div>
            </form>   

            <div className={`veiw-block ${viewBlock}`}/>
        </div>
    )
}
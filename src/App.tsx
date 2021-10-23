
import { useState, useEffect, FormEvent } from 'react'
import * as C from './App.styles'
import * as Photos from './services/photos'
import { Photo } from './types/phostos'
import { PhotoItem } from './components/PhotoItem/index'

const APP = () => {

  const [loading, setLoading] = useState(false);
  const [phostos, setPhotos] = useState<Photo[]>([])
  const [uploading, setUploading] = useState(false);

  useEffect(() => {

    const getPhotos = async () => {
      setLoading(true);
      setPhotos(await Photos.getAll());
      setLoading(false);
    }
    getPhotos();
  }, [])


  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const file = formData.get('image') as File;
    if (file && file.size > 0) {
      setUploading(true);
      //Faz upload do arquivo
      let result = await Photos.insert(file);
      setUploading(false);

      if (result instanceof Error) {
        alert(`${result.name}-${result.message}`)
      } else {
        let newPhotoList = [...phostos]
        newPhotoList.push(result);
        setPhotos(newPhotoList);
      }
    }
  }


  return (
    <C.Container>
      <C.Area>
        <C.Header> Galeria de Fotos </C.Header>

        {/* Area de Upload */}
        <C.UploadForm method="POST" onSubmit={handleFormSubmit}>
          <input type="file" name="image" />
          <input type="submit" value="Enviar" />

          {uploading &&
            <div>Enviando... </div>
          }

        </C.UploadForm>




        {/* Lista de fotos */}
        {loading &&
          <C.ScreenWarning>
            <div className="emoji">🤚</div>
            <div>Carregando... </div>
          </C.ScreenWarning>
        }

        {!loading && phostos.length > 0 &&
          <C.PhotoList>
            {phostos.map((item, index) => (
              <PhotoItem key={index} url={item.url} name={item.name}></PhotoItem>

            ))}
          </C.PhotoList>
        }


        {!loading && phostos.length === 0 &&
          <C.ScreenWarning>
            <div className="emoji">🤚</div>
            <div>Não tem fotos... </div>
          </C.ScreenWarning>
        }


      </C.Area>

    </C.Container >
  );

}

export default APP;
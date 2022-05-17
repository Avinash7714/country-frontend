import React, {Fragment} from 'react'
import axios from 'axios'

const Home = () => {
  const [countries, setCountries] = React.useState([])
  const [country, setCountry] = React.useState('')
  const [countryName, setCountryName] = React.useState("")
  const [rank, setRank] = React.useState("")
  const [continent, setContinent] = React.useState("")
  const [selectContinent, setSelectedContinent] = React.useState("")
  const [flag, setFlag] = React.useState(null)
  const [nameErr, setNameErr] = React.useState(false)
  const [fieldsErr, setFieldsErr] = React.useState(false)
  const [apiErr, setApiErr] = React.useState("")

  const getAllCountries = async () => {
    let response = await axios.get(
      `http://localhost:8080/countries`,
    );
    setCountries(response.data)
  }

  const getCountry = async (rank) => {
    let response = await axios.get(
      `http://localhost:8080/country/${rank}`,
    );
    setCountry(response.data)
  }

  const getContinents = async () => {
    let response = await axios.get(
      `http://localhost:8080/continents`,
    );
    setContinent(response.data)
  }

  const addCountry = async () => {
    try {
      if (countryName && continent && rank && flag) {
        let formData = new FormData();
        if (countryName) {
          if (countryName.length < 3 || countryName.length > 20) {
            setNameErr(true)
            setTimeout(() => {
              setNameErr(false)
            }, 5000);
            return
          } else {
            formData.append("name", countryName);
          }
          formData.append("continent", selectContinent);
          formData.append("rank", rank);
          formData.append("flag", flag);

          await axios.post(
            `http://localhost:8080/country`,
            formData
          );
        }
      } else {
        setFieldsErr(true)
        setTimeout(() => {
          setFieldsErr(false)
        }, 5000);
        return
      }

    } catch (e) {
      debugger
      setApiErr(e.response.data.storageErrors ? "Only Images (jpeg/png) size limit 4mb" : e.response.data)
      setTimeout(() => {
        setApiErr('')
      }, 5000);
    }

  }


  return (
    <div className="p-10">
      <div className="flex flex-col gap-2">
        <div className="text-center">
          <select onClick={() => getAllCountries()} onChange={(e) => getCountry(e.target.value)} className="border rounded-lg px-10 py-1">
            <option disabled selected>Select</option>
            {countries && countries.length ? countries.map((list, index) => {
              return (
                <Fragment key={index} >
                  <option value={list.rank}>{list.name}</option>
                </Fragment>
              )
            }) : ""}
          </select>
        </div>
        {country ? <div>
          <div className="mt-10">
            <h1 className="font-bold text-2xl">List</h1>
          </div>
          <div className="flex flex-col md:flex-row items-center mt-3 bg-gray-100 p-4 rounded-lg gap-4">
            <div>
              <div className="w-24 h-16">
                <img src={`http://localhost:8080/${country.flag}`} alt="Flag" title="" className="w-full h-full rounded-md object-cover object-center" />
              </div>
            </div>
            <div className="flex-grow">
              <span className="text-md">{country.name}</span>
            </div>
            <div>
              <span className="text-3xl font-extrabold">{country.rank}</span>
            </div>
          </div>
        </div> : ""}
        <div>
          <div className="mt-10">
            <h1 className="font-bold text-2xl">Add</h1>
          </div>
          <div className="bg-blue-100 p-4 rounded-lg">
            <div className="grid grid-cold-1 mt-5 md:grid-cols-3 gap-4">
              <div>
                <label>Country</label>
                <br />
                <input type="text" name="country" onChange={(e) => setCountryName(e.target.value)} className={`border rounded-md w-full px-2 py-1 `} id="" placeholder="Enter Country" />
              </div>
              <div>
                <label>Continent</label>
                <br />
                <select onClick={() => getContinents()} onChange={(e) => setSelectedContinent(e.target.value)} className="border rounded-md w-full px-2 py-1">
                  <option disabled selected>Select</option>
                  {continent && continent.length ? continent.map((list, index) => {
                    return (
                      <Fragment key={index} >
                        <option value={list}>{list}</option>
                      </Fragment>
                    )
                  }) : ""}
                </select>
              </div>
              <div>
                <label>Rank</label>
                <br />
                <input type="number" name="rank" onChange={(e) => setRank(e.target.value)} className="border rounded-md w-full px-2 py-1" id="" placeholder="Enter Rank" />
              </div>
            </div>
            <div className="mt-4">
              <div className="relative inline-block">
                <input type="file" onChange={(e) => setFlag(e.target.files[0])} className="opacity-0 absolute top-0 left-0 w-full h-full cursor-pointer" />
                <button className="bg-green-500 text-white px-4 py-1 rounded-lg pointer-events-none">
                  Select a country flag
                </button>
              </div>
            </div>
            {nameErr && <div className="text-red-500 text-base mt-2">Country name must be between 3 and 20 characters</div>}
            {fieldsErr && <div className="text-red-500 text-base mt-2">Please enter all fields</div>}
            {apiErr ? <div className="text-red-500 text-base mt-2">{apiErr}</div> : ''}
            <div className="text-right mt-5">
              <button className="bg-blue-500 px-4 py-1 text-white rounded-lg" onClick={() => addCountry()}>
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home;
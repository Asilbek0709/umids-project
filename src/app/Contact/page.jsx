"use client"

import { useTranslation } from "react-i18next"
import { TextField } from "@mui/material"

export default function Contact() {
 
  const { t } = useTranslation()

  return(
    <>
      <div class="flex flex-col bg-accent p-20 ">
        <h1 class="text-balance">Biz bilang bog'laning</h1>
        <div className="customerInfo">
          <TextField id="outlined-basic" label="Ism" variant="outlined" placeholder="Ism"/>
          <TextField id="outlined-basic" label="Familiya" variant="outlined" placeholder="Familiya"/>
        </div>
        <TextField id="outlined-basic" label="Email manzilingiz" variant="outlined" placeholder="Email manzilingiz"/>
         <TextField
          id="standard-multiline-static"
          label="Izoh qoldiring"
          multiline
          rows={7}
          variant="standard"
        />
      </div>
    </>
  )
}
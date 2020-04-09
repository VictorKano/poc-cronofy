import React, { Component } from 'react';
import axios from 'axios';


export default class Cronofy extends Component {

  constructor(props) {
    super(props);

    const search = window.location.search;
    const params = new URLSearchParams(search);

    this.state = {
      client_id: 'ISmdLFMwektUCq_ghHWGoaRtCYZdQM1X',
      client_secret: 'DM7Tj4kokMdPNi6QP3CWi_GfoRKeIr_7sqhk2wsWBpi3OXxBG8n8pJirHu5xlYOQBxdeSrfkUxkqkO07fMWN-w',
      redirect_uri: 'http://192.168.56.1:3000',
      scope: 'read_write',
      token_api_uri: 'https://api.cronofy.com/oauth/token',
      calendar_api_uri: 'https://api.cronofy.com/v1/calendars',
      code: params.get('code'),
    }

    this.authorization = this.authorization.bind(this);
    this.saveCalendarEvent = this.saveCalendarEvent.bind(this);
  }

  authorization() {
    const url = `https://app.cronofy.com/oauth/authorize?response_type=code&client_id=${this.state.client_id}&redirect_uri=${this.state.redirect_uri}&scope=${this.state.scope}`;
    window.open(url, '_self');
  }

  async getAccessToken() {
    const PROXY_URL = 'https://cors-anywhere.herokuapp.com/';

    await axios.post(PROXY_URL + this.state.token_api_uri, {
      client_id: this.state.client_id,
      client_secret: this.state.client_secret,
      grant_type: 'authorization_code',
      code: this.state.code,
      redirect_uri: this.state.redirect_uri
    }).then(async (response) => {
      const PROXY_URL = 'https://cors-anywhere.herokuapp.com/';
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('refresh_token', response.data.refresh_token);
      localStorage.setItem('profile_name', response.data.linking_profile.profile_name);
      await axios.get(PROXY_URL + this.state.calendar_api_uri, 
        {headers: {'Authorization': `Bearer ${localStorage.getItem('access_token')}`}})
      .then(async (response) => {
        for(var i=0; i<response.data.calendars.length; i++) {
          if(response.data.calendars[i].profile_name === localStorage.getItem('profile_name')) {
            localStorage.setItem('calendar_id', response.data.calendars[i].calendar_id);
          }
        }
        await axios.post(PROXY_URL + `${this.state.calendar_api_uri}/${localStorage.getItem('calendar_id')}/events`,
          {
            "event_id": "qTtZdczOccgaPncGJaCiLg",
            "summary": "Processo: 0000011-56.2015.5.02.0023: Embargos à Execução - 31/01/2020",
            "description": 'Recte(s): JULIANA MEIRELES DA SILVA \n' +
            'Recdo(as): ASSOCIACAO PARA VALORIZACAO DE PESSOAS COM DEFICIENCIA;MUNICIPIO DE SAO PAULO \n' +
            'Processo: 0000011-56.2015.5.02.0023 \n' +
            'Prosseguimento Necessário: Embargos à Execução \n' +
            'Objeto: Notificação \n' +
            'Vara: 2ª Região: São Paulo - SP - 23ª VT DE SÃO PAULO \n' +
            'Data de publicação: 14/01/2020 \n' +
            'Data de disponibilização: 15/01/2020 \n' +
            'Data de fim: 31/01/2020 \n' +
            'Observações: Discuss plans for the next quarter.',
            "start": "2020-01-15T03:00:00Z",
            "end": "2020-01-27T03:00:00Z",
          }, {headers: {'Authorization': `Bearer ${localStorage.getItem('access_token')}`}})
        .then((response) => {
          alert(response + ' evento criado com sucesso!');
        })
      })
    }).catch((error) => {
      console.log(error);
    })
  }

  saveCalendarEvent() {
    if(this.state.code !== null) {
      this.getAccessToken();
    }
  }

  render() {
    return (
      <div className="cronofy">
        <input type="button" value="Auth" onClick={this.authorization}/>
        <input type="button" value="Save Calendar Event" onClick={this.saveCalendarEvent}/>
      </div>
    )
  }
}
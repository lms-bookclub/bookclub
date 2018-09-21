import Config from 'config';
import { Environment } from '@shared/types';
import BookClient from 'clients/BookClient';
import UserClient from 'clients/UserClient';
import SeasonClient from 'clients/SeasonClient';
import VotingSessionClient from 'clients/VotingSessionClient';

if (Config.ENV === Environment.LOCAL) {
  window['Config'] = Config;
  window['BookClient'] = BookClient;
  window['UserClient'] = UserClient;
  window['SeasonClient'] = SeasonClient;
  window['VotingSessionClient'] = VotingSessionClient;
}
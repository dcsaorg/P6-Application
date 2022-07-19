import { PublisherRole } from '../enums/publisherRole';

export interface PublisherPattern {
    id: string;
    publisherRole: PublisherRole;
    primaryReceiver: PublisherRole;

}

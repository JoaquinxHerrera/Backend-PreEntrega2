export class TicketRepository {
    constructor(dao) {
      this.dao = dao;
    }
    async createTicket(data) {
      const ticket = await this.dao.create(data);
      return ticket;
    }
  
    async getTicket() {
      return await this.dao.readMany({});
    }
  
    async getTicketById(id) {
      const ticketForId = await this.dao.readOne({ _id: id });
      return ticketForId;
    }
  
    async updateOne(id, data) {
      return this.dao.updateOne(id, data);
    }
  
    async deleteOne(id) {
      return this.dao.deleteOne(id);
    }
}
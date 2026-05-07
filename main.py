#!/usr/bin/env python3
import asyncio, logging, sys
from pathlib import Path
from telegram.ext import ApplicationBuilder
from config import Config
from database import Database
from auction import AuctionManager
from handlers.admin_private import register_admin_handlers
from handlers.group_messages import register_group_handlers

logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.INFO)
logger = logging.getLogger(__name__)
logging.getLogger("httpx").setLevel(logging.WARNING)

def setup_dirs():
    Path("data").mkdir(exist_ok=True)
    Path("logs").mkdir(exist_ok=True)

class App:
    def __init__(self):
        self.application = None
        self.db = Database()
        self.auction_mgr = AuctionManager()

    async def initialize(self):
        Config.validate()
        setup_dirs()
        await self.db.initialize()
        self.application = ApplicationBuilder().token(Config.BOT_TOKEN).concurrent_updates(True).build()
        register_admin_handlers(self.application)
        register_group_handlers(self.application)
        await self.auction_mgr.restore_timers(self.application)
        logger.info("Bot initialized")

    async def start(self):
        try:
            logger.info("Starting polling...")
            await self.application.initialize()
            await self.application.start()
            await self.application.updater.start_polling(
                drop_pending_updates=True,
                allowed_updates=["message", "callback_query", "my_chat_member"]
            )
            await asyncio.Future()
        except KeyboardInterrupt:
            pass
        finally:
            await self.shutdown()

    async def shutdown(self):
        if self.application:
            await self.application.updater.stop()
            await self.application.stop()
            await self.application.shutdown()
        await self.db.close()

async def main():
    app = App()
    await app.initialize()
    await app.start()

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        sys.exit(0)
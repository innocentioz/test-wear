export default function ContactsPage() {
    return (
        <div className="container mx-auto mt-8">
            <div className="contacts-container">
                <h2 className="text-2xl font-bold mb-4 text-center">Контакты</h2>
                <div className="space-y-6 md:grid md:grid-cols-2 md:place-items-center">

                    <section className="w-1/2 text-right">
                        <h3 className="font-bold">Наш адрес</h3>
                        <p>г. Чебоксары, ул. Энтузиастов, д. 31</p>
                    </section>

                    <section className="w-1/2 text-left">
                        <h3 className="font-bold">Телефоны для связи</h3>
                        <p>+7 (937) 123-45-67</p>
                        <p>+7 (927) 555-35-35 (бесплатно по России)</p>
                    </section>

                    <section className="w-1/2 text-right">
                        <h3 className="font-bold">Электронная почта</h3>
                        <p>support@limitlesswear.com</p>
                    </section>
                    
                    <section className="w-1/2 text-left">
                        <h3 className="font-bold">Рабочие часы</h3>
                        <p>Понедельник - Пятница: 10:00 - 18:00</p>
                        <p>Суббота - Воскресенье: 11:00 - 17:30</p>
                    </section>
                </div>

                
                <section className="flex flex-col items-center mt-6">
                    <h3 className="font-bold text-lg">Мы на карте</h3>
                    <div className="mt-4">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d1870.420219365623!2d47.184282671608045!3d56.11703376701737!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sru!2sru!4v1726899019824!5m2!1sru!2sru"
                        width="600"
                        height="450"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                    </div>
                </section>
            </div>
        </div>
    )
}
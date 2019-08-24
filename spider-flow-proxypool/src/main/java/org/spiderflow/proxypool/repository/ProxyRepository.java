package org.spiderflow.proxypool.repository;

import org.spiderflow.proxypool.model.Proxy;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProxyRepository extends JpaRepository<Proxy, Integer>{

}
